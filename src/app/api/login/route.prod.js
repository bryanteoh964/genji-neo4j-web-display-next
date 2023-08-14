import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

const PASSWORD = process.env.PASSWORD_PROTECT;

export async function POST(req, res) {
    if (req.method !== "POST") {
        return new NextResponse(405).text("Method Not Allowed");
    }
    const body = await req.json()
    const password = body.password;

    if (PASSWORD === password) {
        const loginUrl = req.nextUrl.origin
        const response = NextResponse.redirect(loginUrl);
        const cookie = serialize("login", "true", {
            path: '/',
            httpOnly: true,
            secure: true,
        });
        response.cookies.set("login", cookie)
        return response
    } else {
        redirect('/login');
    }
}