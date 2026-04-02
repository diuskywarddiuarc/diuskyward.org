import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Block only critical malicious injection patterns
const CRITICAL_THREATS = [
  'select%20from', 'insert%20into', 'drop%20database', 'union%20select', 
  '--', '/**/', '<script', 'javascript:', 'onerror=', 'onload=', 'eval(',
  'wp-admin', 'wp-login', 'xmlrpc', 'autodiscover'
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const url = (pathname + search).toLowerCase();

  // Only block critical security threats (SQL injection, XSS, WordPress hacks)
  const hasThreat = CRITICAL_THREATS.some(pattern => url.includes(pattern));

  if (hasThreat) {
    console.warn(`[SECURITY] Suspicious request blocked: ${pathname} from ${userAgent}`);
    return new NextResponse('Access Denied', { status: 403 });
  }

  // Add request tracing header for monitoring
  const response = NextResponse.next();
  response.headers.set('X-Request-ID', crypto.randomUUID());
  
  return response;
}

// Only run on specific paths to avoid overhead on static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - media (public media assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|media).*)',
  ],
};
