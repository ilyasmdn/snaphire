import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/firebase/admin';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  const isAppRoute = request.nextUrl.pathname.startsWith('/app');

  // If it's not an app route, continue
  if (!isAppRoute) {
    return NextResponse.next();
  }

  try {
    // Verify the session token
    if (!token) {
      throw new Error('No session token');
    }

    // Verify Firebase token
    await auth.verifySessionCookie(token, true);

    // User is authenticated, allow access
    return NextResponse.next();
  } catch (error) {
    // Redirect to sign-in page
    const redirectUrl = new URL('/sign-in', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
}

// Only run middleware on app routes
export const config = {
  matcher: '/app/:path*',
};