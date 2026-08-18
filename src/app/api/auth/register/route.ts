import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, validatePasswordStrength, createSessionToken, getAuthCookieHeader } from '@/lib/auth';
import { rateLimiter } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const rateCheck = await rateLimiter.check(`register:${ip}`, 5, 3600); // 5 attempts per hour
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Too many registration attempts. Please try again in ${rateCheck.retryAfter} seconds.`,
          },
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, password, username, role, organisation, country, city, bio } = body;

    if (!name || !name.trim() || !email || !email.trim() || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Name, email, and password are required',
          },
        },
        { status: 400 }
      );
    }

    const passCheck = validatePasswordStrength(password);
    if (!passCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: passCheck.error || 'Password must be at least 8 characters long',
          },
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await db.getUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMAIL_ALREADY_EXISTS',
            message: 'An account already exists with this email',
          },
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const userProfile = await db.createUser({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      username: username || name,
      role: role ? role.trim() : '',
      organisation: organisation ? organisation.trim() : '',
      country: country ? country.trim() : '',
      city: city ? city.trim() : '',
      bio: bio ? bio.trim() : '',
      status: 'draft',
      preferredLanguage: 'en',
    });

    const token = await createSessionToken({
      userId: userProfile.id,
      email: userProfile.email,
      username: userProfile.username,
      name: userProfile.name,
      role: userProfile.role,
      isAdmin: false,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: userProfile,
        },
      },
      { status: 201 }
    );

    response.headers.set('Set-Cookie', getAuthCookieHeader(token));
    return response;
  } catch (error: any) {
    if (error.message === 'EMAIL_ALREADY_EXISTS') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMAIL_ALREADY_EXISTS',
            message: 'An account already exists with this email',
          },
        },
        { status: 409 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: 'Unable to create account. Please check your connection and try again.',
        },
      },
      { status: 500 }
    );
  }
}
