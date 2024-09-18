import { type NextRequest, NextResponse } from 'next/server';
import { USERS_ONLY_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME, LOGIN_ROUTE, REGISTER_ROUTE, HOME_USERS_ROUTE } from './app/utils/constants';

const protectedRoutes = [
  USERS_ONLY_ROUTE,
  '/calendar/client/:path*',
  '/calendar/professional/:path*',
  '/availability/client/:path*',
  '/availability/professional/:path*'
];

export default function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || '';

  // Redirect to login if session is not set
  if (!session && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    const absoluteURL = new URL(LOGIN_ROUTE, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  // Redirect to home if session is set and user tries to access root or login or register
  if (session && (request.nextUrl.pathname === ROOT_ROUTE || request.nextUrl.pathname === LOGIN_ROUTE || request.nextUrl.pathname === REGISTER_ROUTE)) {
    const absoluteURL = new URL(HOME_USERS_ROUTE, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}