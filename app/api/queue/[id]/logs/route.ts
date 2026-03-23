import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const session = getSessionFromRequest(req);
	if (!session)
		return NextResponse.json(
			{ success: false, message: "Not authenticated" },
			{ status: 401 }
		);

	const { id } = await params;

	// Verify queue entry belongs to the user's restaurant
	const queueEntry = await prisma.queueEntry.findFirst({
		where: { id, restaurantId: session.restaurantId },
	});

	if (!queueEntry) {
		return NextResponse.json(
			{ success: false, message: "Queue entry not found" },
			{ status: 404 }
		);
	}

	const logs = await prisma.queueEntryLog.findMany({
		where: { queueEntryId: id },
		orderBy: { createdAt: "desc" },
	});

	return NextResponse.json({ success: true, logs });
}
