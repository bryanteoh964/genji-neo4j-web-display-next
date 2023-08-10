import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/', '/index'],
}

export function middleware(req) {
  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === '4dmin' && pwd === 'testpwd123') {
      return NextResponse.next()
    }
  }
  url.pathname = '/api/auth'

  return NextResponse.rewrite(url)
}

// import { NextRequest, NextResponse } from "next/server";


// const isPasswordEnabled = true
// export async function middleware(req){
//     const isLoggedIn = req.cookies.has('login');
//     const isPathPasswordProtect = req.nextUrl.pathname.startsWith("/password-protect")
//     if(isPasswordEnabled && !isLoggedIn && !isPathPasswordProtect){
//         console.log("------------------REDIRECTING TO THE CORRECT PAGE------------------")
//         return NextResponse.redirect(new URL("/password-protect", req.url))
//     }
//     return NextResponse.next()
// }

// export const config = {
//     matcher: [
//       /*
//        * Match all request paths except for the ones starting with:
//        * - api (API routes)
//        * - _next/static (static files)
//        * - favicon.ico (favicon file)
//        */
//         '/((?!_next/static|favicon.ico|login|).*)',
//     //   '/((?!api|_next/static|favicon.ico|under-development.svg).*)',
//     ],
//   }