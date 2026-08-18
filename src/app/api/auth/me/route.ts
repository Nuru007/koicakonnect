import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { db, sanitizeSessionUser } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || !session.userId) {
      return NextResponse.json({ success: true, data: { user: null }, user: null });
    }

    const user = await db.getUserById(session.userId);
    if (!user || user.isDeactivated) {
      return NextResponse.json({ success: true, data: { user: null }, user: null });
    }

    const profile = await db.getUserByUsername(user.username);
    if (!profile) {
      return NextResponse.json({ success: true, data: { user: null }, user: null });
    }

    const sanitized = sanitizeSessionUser(profile);

    return NextResponse.json({
      success: true,
      data: { user: sanitized },
      user: sanitized,
    });
  } catch (error) {
    console.error('Error fetching session user:', error);
    return NextResponse.json({ success: true, data: { user: null }, user: null });
  }
}
