import { NextResponse } from 'next/server';

export async function GET() {
  // Create a large cookie value with more than 4k characters (4096 bytes)
  const largeCookieValue = 'A'.repeat(5000);

  const response = NextResponse.json({
    message: 'Cookie set successfully',
    cookieLength: largeCookieValue.length,
  });

  response.cookies.set('largeCookie', largeCookieValue, {
    httpOnly: false,
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  return response;
}
