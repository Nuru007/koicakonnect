import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSessionToken, getAuthCookieHeader } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, username, role, organisation, country, city, bio } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const userProfile = db.createUser({
      name,
      email,
      passwordHash,
      username: username || name,
      role: role || '',
      organisation: organisation || '',
      country: country || '',
      city: city || '',
      bio: bio || '',
      status: 'draft', // Initial state is draft until published
      preferredLanguage: 'en',
    });

    const token = await createSessionToken({
      userId: userProfile.id,
      email: userProfile.email,
      username: userProfile.username,
      name: userProfile.name,
      role: userProfile.role,
      isAdmin: !!userProfile.isAdmin,
    });

    const response = NextResponse.json(
      { success: true, user: userProfile },
      { status: 201 }
    );

    response.headers.set('Set-Cookie', getAuthCookieHeader(token));
    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}
