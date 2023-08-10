// api/password-protect.js

import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function POST(req, res) {
    // return NextResponse.redirect('http://localhost:3000/');
    // res.redirect(307, '/');
    // console.log("THE requested method is", req.method)
    if (req.method !== "POST") {
        return new NextResponse(405).text("Method NOT Allowed");
    }
    const body = await req.json()
    const password = body.password;
    console.log("------------------------PASSWORD IS-------------------", password)

    if (process.env.PASSWORD_PROTECT === password) {
        console.log("--------------PASSWORD IS CORRECT--------------", password)
        // const cookie = serialize('login', 'true', {
        //     path: '/',
        //     httpOnly: true
        // });
        // const response = new NextResponse(null);
        // response.headers.set('Set-Cookie', cookie);
        console.log("--------------Origin URL--------------", req.nextUrl.origin)
        const loginUrl = new URL('/', req.nextUrl.origin);
        loginUrl.searchParams.set('from', req.nextUrl.origin);
        // console.l og("--------------LOGIN URL--------------", loginUrl)
        // return NextResponse.redirect(redirectUrl.toString());
        console.log("This ran 1")
        const response = NextResponse.redirect('http://localhost:3000/');
        response.cookies.set('login', 'true')
        return response
    } else {
        console.log("--------------PASSWORD IS WRONG--------------", password)
        redirect('/password-protect');
        const url = req.nextUrl.clone(); 
        url.pathname = "/password-protect";
        return NextResponse.redirect(url.toString());
    }
}


// import { serialize } from 'cookie';
// import { NextResponse } from 'next/server';
// import { NextApiRequest, NextApiResponse } from 'next';

// async function handler(req, res){
//     console.log("------------------------")
    
//     if(req.method !== "POST"){
//         res.status(405).send("Method Not Allowed")
//     }
//     const body = await req.json()
//     const password = body.password;
//     console.log("------------------------")
//     console.log("THIS IS THE REQUEST BODY PASSWORD!", password)
//     console.log("------------------------")
//     if(process.env.PASSWORD_PROTECT === password){
//         // const cookie = serialize('login', 'true', {
//         //     path: '/',
//         //     httpOnly: true
//         // })
//         // res.setHeader('Set-Cookie', cookie)
//         // res.redirect(302, '/')
//         return new NextResponse().cookie('login', 'true', {
//             path: '/',
//             httpOnly: true
//         }).redirect('/');
//     } else {
//         const url = new URL("/password-protect", req.headers["origin"])
//         url.searchParams.append("error", "Incorrect Password")
//         res.redirect(url.toString())
//     }
// }

// export {handler as POST}