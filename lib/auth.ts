import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-prod";
const COOKIE_NAME = "queueless_session";

export function createSessionToken(payload: { userId: string; restaurantId: string }) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySessionToken(token: string) {
	try {
		return jwt.verify(token, JWT_SECRET) as { userId: string; restaurantId: string };
	} catch {
		return null;
	}
}

export function getSessionFromRequest(req: NextRequest) {
	const token = req.cookies.get(COOKIE_NAME)?.value;
	if (!token) return null;
	return verifySessionToken(token);
}

export function setSessionCookie(token: string) {
	const expires = new Date();
	expires.setDate(expires.getDate() + 7);

	return `queueless_session=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
}
