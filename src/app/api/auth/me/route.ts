import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, clearAuthCookie } from '@/lib/auth';
import { db, sanitizeSessionUser } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || !session.userId) {
      const response = NextResponse.json({ success: true, data: { user: null }, user: null });
      response.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
      return response;
    }

    const user = await db.getUserById(session.userId);
    if (!user || user.isDeactivated) {
      const response = NextResponse.json({ success: true, data: { user: null }, user: null });
      response.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
      clearAuthCookie(response);
      return response;
    }

    const profile = await db.assembleUserProfile(user);
    const sanitized = sanitizeSessionUser(profile);

    const response = NextResponse.json({
      success: true,
      data: { user: sanitized },
      user: sanitized,
    });
    response.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
    return response;
  } catch (error) {
    console.error('Error fetching session user in /api/auth/me:', error);
    const response = NextResponse.json({ success: true, data: { user: null }, user: null });
    response.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
    return response;
  }
}
