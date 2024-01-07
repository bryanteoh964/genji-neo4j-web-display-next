import { NextResponse } from "next/server";

const isPasswordEnabled = !!process.env.PASSWORD_PROTECT && false;

// Note: Cookie and cookie check isn't secure yet
export function middleware(req) {
	const isLoggedIn = req.cookies.has('login');
	const isPathPasswordProtect = req.nextUrl.pathname.startsWith("/login");
	if (isPasswordEnabled && !isLoggedIn && !isPathPasswordProtect) {
		req.nextUrl.pathname = "/login";
		return NextResponse.redirect(req.nextUrl);
	}
	return NextResponse.next();
}

export const config = {
    matcher: [
		/*
		* Match all request paths except for the ones starting with:
		* - api (API routes)
		* - _next/static (static files)
		* - favicon.ico (favicon file)
		*/
		'/((?!api|_next/static|favicon.ico|under-development.svg).*)',
    ],
}