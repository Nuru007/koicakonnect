import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = await db.getUserByUsername(user.username);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 400 }
    );
  }
}
