import { prisma } from "@/lib/prisma";
import { hashOtp, normalizePhone, sendWhatsAppMessage, errorResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestOtpSchema = z.object({ phoneNumber: z.string().min(6) });

export async function POST(req: NextRequest) {
	const body = await req.json();
	const parse = requestOtpSchema.safeParse(body);
	if (!parse.success) return errorResponse(400, "Invalid payload");

	const phone = normalizePhone(parse.data.phoneNumber);
	const windowStart = new Date(Date.now() - 10 * 60 * 1000);
	const recent = await prisma.oTPRequest.count({
		where: { phoneNumber: phone, createdAt: { gte: windowStart }, used: false },
	});

	if (recent >= 3) {
		return errorResponse(429, "Too many OTP requests. Try again in 10 minutes.");
	}

	const code =
		process.env.NODE_ENV === "production"
			? String(Math.floor(100000 + Math.random() * 900000))
			: "123456"; // Fixed OTP for development
	const codeHash = await hashOtp(code);
	const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

	await prisma.oTPRequest.create({
		data: { phoneNumber: phone, codeHash, expiresAt },
	});

	await sendWhatsAppMessage(
		phone,
		`Your Queue Less OTP is ${code}. Valid for 5 minutes.`,
	);

	return NextResponse.json({ success: true, message: "OTP sent via WhatsApp." });
}
