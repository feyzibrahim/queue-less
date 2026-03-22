import { prisma } from "@/lib/prisma";
import {
	parseCustomerSize,
	sendWhatsAppMessage,
	normalizePhone,
	errorResponse,
} from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const joinSchema = z.object({
	phoneNumber: z.string(),
	name: z.string().min(2),
	customerSize: z.string(),
	restaurantId: z.string().optional(),
});

export async function POST(req: NextRequest) {
	const body = await req.json();
	const parse = joinSchema.safeParse(body);
	if (!parse.success) return errorResponse(400, "Invalid payload");

	const phone = normalizePhone(parse.data.phoneNumber);
	const customerSize = parseCustomerSize(parse.data.customerSize.toString());
	if (customerSize === null || customerSize <= 0)
		return errorResponse(400, "Could not parse customer size.");

	const restaurantId = parse.data.restaurantId;
	if (!restaurantId) return errorResponse(400, "restaurantId is required.");

	const currentMax = await prisma.queueEntry.aggregate({
		_max: { position: true },
		where: { restaurantId, status: "waiting" },
	});

	const position = (currentMax._max.position ?? 0) + 1;
	const waitTime = customerSize * 6;

	const queueEntry = await prisma.queueEntry.create({
		data: {
			customerName: parse.data.name,
			phoneNumber: phone,
			customerSize,
			position,
			status: "waiting",
			restaurantId,
		},
	});

	const message = `🎉 You're in the queue!\n\n👥 Customer Size: ${customerSize}\n📍 Position: ${position}\n⏱ Wait Time: ~${waitTime} mins\n\nWe'll notify you when your table is ready.`;
	sendWhatsAppMessage(phone, message);

	return NextResponse.json({ success: true, queueEntry, waitTime });
}
