import { getSessionFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

const updateSchema = z.object({ enabled: z.boolean() });

export async function PATCH(req: NextRequest) {
	const session = getSessionFromRequest(req);
	if (!session)
		return NextResponse.json(
			{ success: false, message: "Unauthorized" },
			{ status: 401 }
		);

	const body = await req.json();
	const parse = updateSchema.safeParse(body);
	if (!parse.success)
		return NextResponse.json(
			{ success: false, message: "Invalid request" },
			{ status: 400 }
		);

	try {
		// Read the .env file
		const envPath = path.join(process.cwd(), ".env");
		const envContent = await fs.readFile(envPath, "utf8");
		
		// Update or add WHATSAPP_ENABLED
		const lines = envContent.split("\n");
		let updated = false;
		
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].startsWith("WHATSAPP_ENABLED=")) {
				lines[i] = `WHATSAPP_ENABLED=${parse.data.enabled}`;
				updated = true;
				break;
			}
		}
		
		// If not found, add it at the end
		if (!updated) {
			lines.push(`WHATSAPP_ENABLED=${parse.data.enabled}`);
		}
		
		// Write back to .env file
		await fs.writeFile(envPath, lines.join("\n"));
		
		return NextResponse.json({
			success: true,
			message: `WhatsApp ${parse.data.enabled ? "enabled" : "disabled"}`,
		});
	} catch (error) {
		console.error("Failed to update WhatsApp setting:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to update setting" },
			{ status: 500 }
		);
	}
}
