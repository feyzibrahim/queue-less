import { prisma } from "@/lib/prisma";
import {
	verifyOtp,
	normalizePhone,
	sendWhatsAppMessage,
	errorResponse,
} from "@/lib/utils";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const verifyOtpSchema = z.object({
	phoneNumber: z.string().min(6),
	code: z.string().min(6).max(6),
});

export async function POST(req: NextRequest) {
	const body = await req.json();
	const parse = verifyOtpSchema.safeParse(body);
	if (!parse.success) return errorResponse(400, "Invalid payload");

	const phone = normalizePhone(parse.data.phoneNumber);
	const requestedOtp = await prisma.oTPRequest.findFirst({
		where: { phoneNumber: phone, used: false, expiresAt: { gte: new Date() } },
		orderBy: { createdAt: "desc" },
	});

	if (!requestedOtp) {
		return errorResponse(410, "No valid OTP found or OTP expired.");
	}

	const valid = await verifyOtp(requestedOtp.codeHash, parse.data.code);
	if (!valid) return errorResponse(401, "Invalid OTP.");

	await prisma.oTPRequest.update({
		where: { id: requestedOtp.id },
		data: { used: true },
	});

	let user = await prisma.user.findUnique({ where: { phoneNumber: phone } });

	let restaurantId: string;
	if (!user) {
		const restaurant = await prisma.restaurant.create({
			data: {
				name: `Queue Less ${phone}`,
				slug: `queueless-${phone.replace(/\D/g, "")}`,
				phone,
			},
		});

		user = await prisma.user.create({
			data: {
				phoneNumber: phone,
				name: "Staff",
				role: "ADMIN",
				restaurantId: restaurant.id,
			},
		});

		restaurantId = restaurant.id;
	} else {
		restaurantId = user.restaurantId;
	}

	const token = createSessionToken({ userId: user.id, restaurantId });
	const response = NextResponse.json({
		success: true,
		user: { id: user.id, phoneNumber: user.phoneNumber, restaurantId },
		message: "Logged in",
	});
	response.headers.append("Set-Cookie", setSessionCookie(token));
	sendWhatsAppMessage(
		phone,
		"Your staff session is now active in Queue Less dashboard.",
	);

	return response;
}
