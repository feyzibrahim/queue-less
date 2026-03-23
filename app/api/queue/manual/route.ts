import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createEntrySchema = z.object({
	customerName: z.string().min(1, "Customer name is required"),
	phoneNumber: z.string().min(1, "Phone number is required"),
	customerSize: z.number().min(1, "Customer size must be at least 1"),
});

export async function POST(req: NextRequest) {
	const session = getSessionFromRequest(req);
	if (!session)
		return NextResponse.json(
			{ success: false, message: "Unauthorized" },
			{ status: 401 }
		);

	const body = await req.json();
	const parse = createEntrySchema.safeParse(body);
	if (!parse.success)
		return NextResponse.json(
			{ success: false, message: "Invalid request data", errors: parse.error.errors },
			{ status: 400 }
		);

	const { customerName, phoneNumber, customerSize } = parse.data;

	try {
		// Get the current highest position for waiting customers
		const lastWaiting = await prisma.queueEntry.findFirst({
			where: { 
				restaurantId: session.restaurantId,
				status: "waiting"
			},
			orderBy: { position: "desc" },
		});

		const newPosition = lastWaiting ? lastWaiting.position + 1 : 1;

		// Create the new queue entry
		const newEntry = await prisma.queueEntry.create({
			data: {
				customerName,
				phoneNumber,
				customerSize,
				position: newPosition,
				status: "waiting",
				restaurantId: session.restaurantId,
			},
		});

		// Create initial log entry
		await prisma.queueEntryLog.create({
			data: {
				queueEntryId: newEntry.id,
				oldStatus: null,
				newStatus: "waiting",
				changedBy: session.phoneNumber,
				changeReason: "Manual entry added by staff",
			},
		});

		return NextResponse.json({
			success: true,
			message: "Customer added to queue successfully",
			entry: newEntry,
		});
	} catch (error) {
		console.error("Failed to create queue entry:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to add customer to queue" },
			{ status: 500 }
		);
	}
}
