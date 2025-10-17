# Cookie Size Issue Reproduction - Next.js on Vercel

This repository reproduces an issue where setting a large cookie (exceeding 4KB) in a Next.js route handler deployed on Vercel causes the cookie to silently fail to appear in middleware, rather than throwing an exception.

## Issue Description

When a cookie larger than the standard 4KB limit is set via a route handler on Vercel, the cookie does not appear in the middleware's `request.cookies` object. This silent failure can lead to unexpected behavior in applications that rely on middleware to process cookies.

**Expected behavior:** The application should throw an exception when attempting to set a cookie that exceeds size limits, making the issue immediately apparent during development or testing.

**Actual behavior:** The cookie is silently not set, and middleware cannot access it without any error or warning.

## Reproduction Steps

1. Clone this repository
2. Deploy to Vercel (or run locally with `npm run dev`)
3. Visit the `/set-cookie` route to set a large cookie (5000 characters)
4. Observe that the middleware logs "Cookie not found" instead of reading the cookie

## Project Structure

### Route Handler (`src/app/set-cookie/route.ts`)

Sets a cookie with 5000 'A' characters (exceeding the typical 4KB browser limit):

```typescript
export async function GET() {
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
```

### Middleware (`src/middleware.ts`)

Attempts to read the cookie and logs whether it was found:

```typescript
export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('largeCookie');

  if (cookie) {
    console.log('Cookie length:', cookie.value.length);
  } else {
    console.log('Cookie not found');
  }

  return NextResponse.next();
}
```

## Testing

1. Visit `http://localhost:3000/set-cookie` (or your Vercel deployment URL + `/set-cookie`)
2. Check the server logs - you should see "Cookie not found" in the middleware logs
3. Check browser DevTools Network tab - the Set-Cookie header may not appear or may be rejected by the browser

## Environment

- Next.js (App Router)
- Deployed on Vercel
- Node.js runtime

## Expected Fix

The framework should validate cookie sizes and throw an exception when attempting to set a cookie that exceeds the standard 4KB limit, rather than silently failing. This would help developers catch these issues during development rather than discovering them in production.

## Related Information

- Standard cookie size limit: 4096 bytes (4KB) per cookie
- Most browsers enforce this limit silently
- RFC 6265 recommends a minimum of 4096 bytes per cookie
