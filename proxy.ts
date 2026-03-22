import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
	"/",
	"/api/auth/request-otp",
	"/api/auth/verify-otp",
	"/api/webhook/whatsapp",
	"/login",
];

export default function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
		return NextResponse.next();
	}

	const token = req.cookies.get("queueless_session");
	if (!token) {
		const url = req.nextUrl.clone();
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/api/queue/:path*", "/settings"],
};
