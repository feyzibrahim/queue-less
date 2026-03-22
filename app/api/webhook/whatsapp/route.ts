import { prisma } from "@/lib/prisma";
import { normalizePhone, parseCustomerSize, sendWhatsAppMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

type WebhookPayload = { from: string; message: string };

function isGreeting(msg: string) {
	return ["hi", "hello", "hey", "hii", "hi there"].includes(msg.toLowerCase().trim());
}

async function sendMenu(phone: string) {
	const body = `👋 Welcome to Queue Less!\n\nHow can I help you?\n1️⃣ Join Queue\n2️⃣ Check Status\n3️⃣ Cancel Booking\n\nReply with a number.`;
	await sendWhatsAppMessage(phone, body);
}

export async function POST(req: NextRequest) {
	let from: string;
	let message: string;

	if (req.headers.get("content-type")?.includes("application/json")) {
		const payload: WebhookPayload = await req.json();
		from = normalizePhone(payload.from);
		message = payload.message.trim();
	} else {
		const form = await req.formData();
		from = normalizePhone(String(form.get("From") ?? form.get("from") ?? ""));
		message = String(form.get("Body") ?? form.get("body") ?? "").trim();
	}

	const state = await prisma.conversationState.findUnique({
		where: { phoneNumber: from },
	});

	if (!from) {
		return NextResponse.json(
			{ success: false, message: "Missing from phone" },
			{ status: 400 },
		);
	}
	if (!state || isGreeting(message)) {
		// Reset when greeting or new session
		await prisma.conversationState.upsert({
			where: { phoneNumber: from },
			update: { state: "MENU", tempData: {} },
			create: { phoneNumber: from, state: "MENU", tempData: {} },
		});

		await sendMenu(from);
		return NextResponse.json({ success: true });
	}

	if (state.state === "MENU") {
		const option = message.trim();
		if (option === "1") {
			await prisma.conversationState.update({
				where: { phoneNumber: from },
				data: { state: "ASK_CUSTOMER_SIZE" },
			});
			await sendWhatsAppMessage(from, "How many people are dining?");
			return NextResponse.json({ success: true });
		}

		if (option === "2") {
			const entries = await prisma.queueEntry.findMany({
				where: { phoneNumber: from, status: "waiting" },
			});
			if (!entries.length) {
				await sendWhatsAppMessage(from, "No active queue entry found.");
			} else {
				const e = entries[0];
				await sendWhatsAppMessage(
					from,
					`You are #${e.position} in queue for ${e.customerSize} people.`,
				);
			}
			await sendMenu(from);
			return NextResponse.json({ success: true });
		}

		if (option === "3") {
			const entry = await prisma.queueEntry.findFirst({
				where: { phoneNumber: from, status: "waiting" },
			});
			if (!entry) {
				await sendWhatsAppMessage(from, "No booking to cancel.");
			} else {
				await prisma.queueEntry.update({
					where: { id: entry.id },
					data: { status: "cancelled" },
				});
				await sendWhatsAppMessage(from, "Your booking has been cancelled.");

				const waiting = await prisma.queueEntry.findMany({
					where: { restaurantId: entry.restaurantId, status: "waiting" },
					orderBy: { position: "asc" },
				});
				for (let i = 0; i < waiting.length; i++) {
					await prisma.queueEntry.update({
						where: { id: waiting[i].id },
						data: { position: i + 1 },
					});
				}
			}
			await sendMenu(from);
			return NextResponse.json({ success: true });
		}

		await sendWhatsAppMessage(from, "Invalid selection. Please choose 1, 2 or 3.");
		await sendMenu(from);
		return NextResponse.json({ success: true });
	}

	if (state.state === "ASK_CUSTOMER_SIZE") {
		const customerSize = parseCustomerSize(message);
		if (!customerSize || customerSize <= 0) {
			await sendWhatsAppMessage(
				from,
				"Could not understand customer size. Please send something like '2' or 'family of 4'.",
			);
			return NextResponse.json({ success: true });
		}

		await prisma.conversationState.update({
			where: { phoneNumber: from },
			data: { state: "ASK_NAME", tempData: { customerSize } },
		});
		await sendWhatsAppMessage(from, "Please enter your name:");
		return NextResponse.json({ success: true });
	}

	if (state.state === "ASK_NAME") {
		const customerSize = (state.tempData as { customerSize?: number })?.customerSize;
		const name = message;

		const restaurant = await prisma.restaurant.findFirst({
			orderBy: { createdAt: "asc" },
		});
		if (!restaurant) {
			await sendWhatsAppMessage(
				from,
				"No restaurant is set up yet. Please try later.",
			);
			return NextResponse.json({ success: false, message: "No restaurant" });
		}

		const currentMax = await prisma.queueEntry.aggregate({
			_max: { position: true },
			where: { restaurantId: restaurant.id, status: "waiting" },
		});
		const position = (currentMax._max.position ?? 0) + 1;
		const waitTime = customerSize ? customerSize * 6 : undefined;

		await prisma.queueEntry.create({
			data: {
				customerName: name,
				phoneNumber: from,
				customerSize: customerSize ?? 1,
				status: "waiting",
				position,
				restaurantId: restaurant.id,
			},
		});

		await prisma.conversationState.delete({ where: { phoneNumber: from } });

		await sendWhatsAppMessage(
			from,
			`🎉 You're in the queue!\n\n👥 Customer Size: ${customerSize}\n📍 Position: ${position}\n⏱ Wait Time: ~${waitTime} mins\n\nWe'll notify you when your table is ready.`,
		);
		return NextResponse.json({ success: true });
	}

	await sendMenu(from);
	return NextResponse.json({ success: true });
}
