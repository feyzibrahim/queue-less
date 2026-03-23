import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { sendWhatsAppMessage, errorResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({ action: z.enum(["notified", "seated", "cancelled"]) });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = getSessionFromRequest(req);
	if (!session) return errorResponse(401, "Not authenticated");

	const { id } = await params;
	const body = await req.json();
	const parse = updateSchema.safeParse(body);
	if (!parse.success) return errorResponse(400, "Invalid request");

	const queue = await prisma.queueEntry.findFirst({
		where: { id, restaurantId: session.restaurantId },
	});
	if (!queue) return errorResponse(404, "Queue entry not found");

	let status = queue.status;
	if (parse.data.action === "notified") {
		status = "notified";
		sendWhatsAppMessage(
			queue.phoneNumber,
			`✅ Hi ${queue.customerName}, your table is ready. Please come now.`,
		);
	}

	if (parse.data.action === "seated") {
		status = "seated";
	}

	if (parse.data.action === "cancelled") {
		status = "cancelled";
	}

	// Create log entry for status change
	if (status !== queue.status) {
		await prisma.queueEntryLog.create({
			data: {
				queueEntryId: queue.id,
				oldStatus: queue.status,
				newStatus: status,
				changedBy: session.phoneNumber,
				changeReason: `Status changed to ${status}`,
			},
		});
	}

	await prisma.queueEntry.update({ where: { id: queue.id }, data: { status } });

	if (parse.data.action === "seated" || parse.data.action === "cancelled") {
		const waiting = await prisma.queueEntry.findMany({
			where: { restaurantId: session.restaurantId, status: "waiting" },
			orderBy: { position: "asc" },
		});

		for (let idx = 0; idx < waiting.length; idx++) {
			await prisma.queueEntry.update({
				where: { id: waiting[idx].id },
				data: { position: idx + 1 },
			});
		}
	}

	return NextResponse.json({ success: true, message: `Status updated to ${status}` });
}
