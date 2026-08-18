import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await req.json().catch(() => ({ action: 'delete' }));

    if (action === 'deactivate') {
      await db.deactivateUser(session.userId);
    } else {
      await db.deleteUser(session.userId);
    }

    const response = NextResponse.json({
      success: true,
      message: action === 'deactivate' ? 'Account deactivated successfully' : 'Account deleted successfully',
    });

    // Clear session cookie
    response.cookies.set({
      name: 'koicakonnect_session',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });
    response.cookies.set({
      name: 'networth_session',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Error deleting/deactivating account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
