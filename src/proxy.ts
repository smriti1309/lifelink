import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

import { parseAndVerifySession, ADMIN_COOKIE_NAME } from '@/lib/admin-session';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle Admin routes separately
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isAdminAuthenticated = !!parseAndVerifySession(adminToken);

    // If user accesses /admin login page while authenticated as admin, redirect to dashboard
    if (pathname === '/admin' || pathname === '/admin/') {
      if (isAdminAuthenticated) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // Protected /admin/* routes require valid admin session
    if (!isAdminAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
  }

  // Update and refresh session if necessary, getting the current authenticated user
  const { supabaseResponse, user } = await updateSession(request);

  // List of public user protected routes that require standard user authentication
  const protectedRoutes = [
    '/profile',
    '/dashboard',
    '/become-donor',
    '/my-requests',
    '/request',
  ];

  // Check if current route is protected (direct match or prefix-slash match)
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // If page is protected and user is not logged in, redirect them to /login
  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Images/assets inside public
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
