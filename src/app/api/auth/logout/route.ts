import { NextResponse } from 'next/server';
import { getClearAuthCookieHeader } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.headers.set('Set-Cookie', getClearAuthCookieHeader());
  return response;
}
