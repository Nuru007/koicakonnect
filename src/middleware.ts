import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'koicakonnect-super-secret-key-2026-production-secure'
);

const COOKIE_NAME = 'koicakonnect_session';
const LEGACY_COOKIE_NAME = 'networth_session';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile/edit',
  '/settings',
  '/admin',
];

const AUTH_ONLY_PAGES = [
  '/signin',
  '/signup',
];

async function verifyToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return Boolean(payload && payload.userId);
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isProtected = PROTECTED_ROUTES.some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isAuthPage = AUTH_ONLY_PAGES.some(page => pathname === page);

  if (!isProtected && !isAuthPage) {
    return NextResponse.next();
  }

  const token =
    req.cookies.get(COOKIE_NAME)?.value ||
    req.cookies.get(LEGACY_COOKIE_NAME)?.value;

  const isValidSession = token ? await verifyToken(token) : false;

  // 1. Protected route access by unauthenticated visitor -> redirect immediately to /signin
  if (isProtected && !isValidSession) {
    const redirectUrl = new URL('/signin', req.url);
    redirectUrl.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Auth page (/signin, /signup) access by already authenticated user -> redirect to /dashboard
  if (isAuthPage && isValidSession) {
    const redirectParam = req.nextUrl.searchParams.get('redirect');
    const destination = redirectParam && redirectParam.startsWith('/') ? redirectParam : '/dashboard';
    return NextResponse.redirect(new URL(destination, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/profile/edit',
    '/profile/edit/:path*',
    '/settings',
    '/settings/:path*',
    '/admin',
    '/admin/:path*',
    '/signin',
    '/signup',
  ],
};
