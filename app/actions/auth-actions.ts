'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { USERS_ONLY_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME, HOME_USERS_ROUTE } from '../utils/constants';

export async function createSession(uid: string) {
  cookies().set(SESSION_COOKIE_NAME, uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // One day
    path: '/',
  });

  redirect(HOME_USERS_ROUTE);
}

export async function removeSession() {
  cookies().delete(SESSION_COOKIE_NAME);

  redirect(ROOT_ROUTE);
}