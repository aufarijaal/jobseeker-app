import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value

  if (request.nextUrl.pathname.startsWith('/account')) {
    if (!accessToken) {
      return NextResponse.redirect(
        new URL(`/auth/signin?message=You need to sign in first`, request.url)
      )
    }
  }

  // if (request.nextUrl.pathname.startsWith('/auth')) {
  //   if (accessToken) {
  //     return NextResponse.redirect(new URL('/', request.url))
  //   }
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/account/:path*',
    '/auth/signin',
    '/auth/signup',
    '/employer/auth/signin',
    '/employer/auth/signup',
  ],
}
