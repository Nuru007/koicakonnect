import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(
  req: NextRequest,
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

    const cleanUsername = username.trim();
    const session = await getSessionFromRequest(req);

    // 1. Try fetching public profile (published & discoverable)
    let profile = await db.getPublicProfileByUsername(cleanUsername);

    // 2. If not public, allow the profile owner or admin to preview their own profile (e.g. draft mode)
    if (!profile && session?.userId) {
      const selfProfile = await db.getUserByUsername(cleanUsername);
      if (selfProfile && (selfProfile.id === session.userId || selfProfile.isAdmin)) {
        profile = selfProfile;
      }
    }

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'Profile not found or currently unpublished',
          },
        },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        profile,
      },
      profile,
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    return response;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
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
