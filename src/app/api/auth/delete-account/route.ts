import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getClearAuthCookieHeader } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || !session.userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be signed in to perform this action',
          },
        },
        { status: 401 }
      );
    }

    const { action } = await req.json().catch(() => ({ action: 'delete' }));

    if (action === 'deactivate') {
      await db.deactivateUser(session.userId);
    } else {
      await db.deleteUser(session.userId);
    }

    const response = NextResponse.json({
      success: true,
      data: {
        message: action === 'deactivate' ? 'Account deactivated successfully' : 'Account deleted successfully',
      },
      message: action === 'deactivate' ? 'Account deactivated successfully' : 'Account deleted successfully',
    });

    response.headers.set('Set-Cookie', getClearAuthCookieHeader());
    return response;
  } catch (error) {
    console.error('Error deleting/deactivating account:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to process account update. Please try again.',
        },
      },
      { status: 500 }
    );
  }
}
