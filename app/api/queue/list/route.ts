import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const session = getSessionFromRequest(req);
	if (!session)
		return NextResponse.json(
			{ success: false, message: "Not authenticated" },
			{ status: 401 },
		);

	const entries = await prisma.queueEntry.findMany({
		where: { restaurantId: session.restaurantId },
		orderBy: [{ status: "asc" }, { position: "asc" }, { createdAt: "asc" }],
	});

	return NextResponse.json({ success: true, entries });
}
