import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if(request.nextUrl.pathname.startsWith('/account')) {
    // console.log('you are visiting /account')
  }
  if(request.nextUrl.pathname.startsWith('/auth/signin')) {
    // console.log('you are visiting signin')
  }
  if(request.nextUrl.pathname.startsWith('/auth/signup')) {
    // console.log('you are visiting signup')
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*', '/auth/signin', '/auth/signup'],
}
