import bcrypt from "bcryptjs";
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextResponse } from "next/server";
import twilio from "twilio";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM =
	process.env.TWILIO_WHATSAPP_FROM || process.env.TWILIO_WHATSAPP_NUMBER;

const twilioClient =
	TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN
		? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
		: null;

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function sendWhatsAppMessage(to: string, body: string) {
	// Check if WhatsApp is enabled via feature flag
	const whatsappEnabled = process.env.WHATSAPP_ENABLED === "true";

	if (!whatsappEnabled) {
		console.log(`📲 [WhatsApp Disabled] Would send to ${to}: "${body}"`);
		return; // Silently skip sending when disabled
	}

	if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
		const msg =
			"Twilio WhatsApp configuration missing: set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and either TWILIO_WHATSAPP_FROM or TWILIO_WHATSAPP_NUMBER.";
		console.error(msg);
		throw new Error(msg);
	}

	const normalizedTo = normalizePhone(to).replace(/^\+?/, "");
	const whatsappTo = `whatsapp:${normalizedTo.startsWith("+") ? normalizedTo : `+${normalizedTo}`}`;

	try {
		await twilioClient!.messages.create({
			from: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
			to: whatsappTo,
			body,
		});
		console.log(`📲 [Twilio WhatsApp] sent to ${whatsappTo}`);
	} catch (error) {
		console.error("Twilio SMS send error", error);
		throw error;
	}
}

export async function hashOtp(code: string) {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(code, salt);
}

export async function verifyOtp(hashed: string, code: string) {
	return bcrypt.compare(code, hashed);
}

export function errorResponse(status: number, message: string) {
	return NextResponse.json({ success: false, message }, { status });
}
export function normalizePhone(phone: string) {
	return phone.replace(/[^0-9+]/g, "");
}

export function parseCustomerSize(input: string) {
	const cleaned = input.toLowerCase().trim();
	const digits = cleaned.match(/(\d+)/);
	if (digits) {
		return Number(digits[0]);
	}

	const wordsToNumbers: Record<string, number> = {
		one: 1,
		two: 2,
		three: 3,
		four: 4,
		five: 5,
		six: 6,
		seven: 7,
		eight: 8,
		nine: 9,
		ten: 10,
	};

	for (const [word, num] of Object.entries(wordsToNumbers)) {
		if (cleaned.includes(word)) return num;
	}

	return null;
}
