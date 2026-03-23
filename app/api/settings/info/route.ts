import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const session = getSessionFromRequest(req);
	if (!session)
		return NextResponse.json(
			{ success: false, message: "Unauthorized" },
			{ status: 401 },
		);

	const restaurant = await prisma.restaurant.findUnique({
		where: { id: session.restaurantId },
	});
	if (!restaurant)
		return NextResponse.json(
			{ success: false, message: "Restaurant not found" },
			{ status: 404 },
		);

	return NextResponse.json({
		success: true,
		restaurant: {
			name: restaurant.name,
			phone: restaurant.phone,
			slug: restaurant.slug,
		},
		whatsappEnabled: process.env.WHATSAPP_ENABLED === "true",
	});
}
