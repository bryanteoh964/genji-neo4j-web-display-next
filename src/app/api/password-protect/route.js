// api/password-protect.js

import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

async function handler(req, res) {
    if (req.method !== "POST") {
        return new NextResponse(405).text("Method Not Allowed");
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
        console.log("--------------Origin URL--------------", req.nextUrl.pathname)
        const loginUrl = new URL('/', req.nextUrl.pathname);
        loginUrl.searchParams.set('from', req.nextUrl.pathname);
        console.log("--------------LOGIN URL--------------", loginUrl)
        // return NextResponse.redirect(redirectUrl.toString());
        return NextResponse.redirect(loginUrl);
    } else {
        console.log("--------------PASSWORD IS WRONG--------------", password)
        const url = req.nextUrl.clone(); 
        url.pathname = "/password-protect";
        return NextResponse.redirect(url.toString());
    }
}

export {handler as POST}


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