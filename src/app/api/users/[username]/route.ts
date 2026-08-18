import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const profile = await db.getUserByUsername(username);
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check visibility permissions
    // If not published, allow only the profile owner or admin to view
    if (profile.status !== 'published') {
      const session = await getSessionFromRequest(req);
      if (!session || (session.userId !== profile.id && !session.isAdmin)) {
        return NextResponse.json({ error: 'Profile not published' }, { status: 404 });
      }
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 });
  }
}
