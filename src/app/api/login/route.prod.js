import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

const PASSWORD = process.env.PASSWORD_PROTECT;

export async function POST(req, res) {
    console.log("===", req.method, req.url, req.nextUrl.pathname, req.nextUrl.origin, req.nextUrl.href)
    if (req.method !== "POST") {
        return new NextResponse(405).text("Method Not Allowed");
    }
    const body = await req.json()
    const password = body.password;

    if (PASSWORD === password) {
        console.log("CORRECT PASSWORD")
        const returnUrl = req.nextUrl.origin + "/"
        const response = NextResponse.redirect(returnUrl);
        const cookie = serialize("login", "true", {
            path: '/',
            httpOnly: true,
            secure: true,
        });
        response.cookies.set("login", cookie)
        return response
    } else {
        console.log("INCORRECT PASSWORD")
        const loginUrl = req.nextUrl.origin + "/login"
        const response = NextResponse.redirect(loginUrl);
        return response
    }
}