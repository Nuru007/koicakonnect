import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || !session.userId) {
      return NextResponse.json({ user: null });
    }

    const user = db.getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    const profile = db.getUserByUsername(user.username);
    return NextResponse.json({ user: profile });
  } catch (error) {
    console.error('Error fetching session user:', error);
    return NextResponse.json({ user: null });
  }
}
