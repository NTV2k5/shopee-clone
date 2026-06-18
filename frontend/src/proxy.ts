import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);

  // If request is for the Vietnamese slug prefix, set 'x-locale' header to 'vi'
  if (pathname.startsWith('/san-pham/')) {
    requestHeaders.set('x-locale', 'vi');
  } else if (pathname.startsWith('/products/')) {
    requestHeaders.set('x-locale', 'en');
  } else {
    requestHeaders.set('x-locale', 'en');
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Only run proxy on product detail routes to avoid unnecessary overhead
export const config = {
  matcher: ['/products/:path*', '/san-pham/:path*'],
};
