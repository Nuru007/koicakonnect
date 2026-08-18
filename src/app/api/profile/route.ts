import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { db, sanitizeSessionUser } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || !session.userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be signed in to view your profile settings',
          },
        },
        { status: 401 }
      );
    }

    const user = await db.getUserById(session.userId);
    if (!user || user.isDeactivated) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User profile not found',
          },
        },
        { status: 404 }
      );
    }

    const profile = await db.getUserByUsername(user.username);
    const sanitized = profile ? sanitizeSessionUser(profile) : null;

    return NextResponse.json({
      success: true,
      data: { profile: sanitized },
      profile: sanitized,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
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

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || !session.userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be signed in to update your profile',
          },
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      name,
      username,
      role,
      organisation,
      country,
      city,
      bio,
      profileImage,
      preferredLanguage,
      status,
      isDiscoverable,
      categoryIds,
      skills,
      interests,
      languageCodes,
      links,
    } = body;

    // Validation when publishing
    if (status === 'published') {
      if (!name || !name.trim()) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Full Name is required before publishing your profile.',
            },
          },
          { status: 400 }
        );
      }
      if (!role || !role.trim()) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Current Role / Profession is required before publishing your profile.',
            },
          },
          { status: 400 }
        );
      }
    }

    // Always use session.userId for the authenticated user ID (never trust browser payload user ID)
    const updatedProfile = await db.updateUserProfile(
      session.userId,
      {
        name,
        username,
        role,
        organisation,
        country,
        city,
        bio,
        profileImage,
        preferredLanguage,
        status,
        isDiscoverable,
      },
      {
        categoryIds,
        skills,
        interests,
        languageCodes,
        links,
      }
    );

    const sanitized = sanitizeSessionUser(updatedProfile);

    return NextResponse.json({
      success: true,
      data: {
        profile: sanitized,
      },
      profile: sanitized,
    });
  } catch (error: any) {
    if (error.message === 'USERNAME_TAKEN') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USERNAME_TAKEN',
            message: 'This username is already taken. Please choose another.',
          },
        },
        { status: 409 }
      );
    }

    console.error('Error updating profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PROFILE_UPDATE_FAILED',
          message: error.message || 'We could not update your profile. Please try again.',
        },
      },
      { status: 400 }
    );
  }
}
