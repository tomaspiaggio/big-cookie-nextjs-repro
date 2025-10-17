import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('largeCookie');

  if (cookie) {
    console.log('Cookie length:', cookie.value.length);
  } else {
    console.log('Cookie not found');
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
