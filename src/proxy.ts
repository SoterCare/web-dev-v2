import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const pathname = request.nextUrl.pathname;
  
  const isLoginPage = pathname === '/dashboard/login';
  const isDashboardRoute = pathname.startsWith('/dashboard');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  if (isDashboardRoute) {
    if (!token && !isLoginPage) {
      const loginUrl = new URL('/dashboard/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    if (token && isLoginPage) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Match dashboard pages and our WebSocket proxy route to inject the Authorization header!
  matcher: ['/dashboard/:path*', '/api/ws/:path*'],
};
