import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(
  _req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    if (!username || !username.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Username parameter is required',
          },
        },
        { status: 400 }
      );
    }

    // Query genuinely public-facing profile (enforcing published & discoverable & non-deactivated)
    const publicProfile = await db.getPublicProfileByUsername(username.trim());
    if (!publicProfile) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'Profile not found',
          },
        },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        profile: publicProfile,
      },
      profile: publicProfile,
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    return response;
  } catch (error: any) {
    console.error('Error fetching public user profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve profile',
        },
      },
      { status: 500 }
    );
  }
}
