import { NextRequest, NextResponse } from 'next/server';
import { db, sanitizeSessionUser } from '@/lib/db';
import { verifyPassword, createSessionToken, setAuthCookie } from '@/lib/auth';
import { rateLimiter } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const rateCheck = await rateLimiter.check(`login:${ip}`, 25, 900); // 25 attempts per 15 mins
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Too many sign-in attempts. Please try again in ${rateCheck.retryAfter} seconds.`,
          },
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and password are required',
          },
        },
        { status: 400 }
      );
    }

    const user = await db.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Unable to sign in with those details. Check your email and password and try again.',
          },
        },
        { status: 401 }
      );
    }

    if (user.isDeactivated) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ACCOUNT_DEACTIVATED',
            message: 'This account is currently unavailable. Please contact Koica Connect support if you believe this is a mistake.',
          },
        },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Unable to sign in with those details. Check your email and password and try again.',
          },
        },
        { status: 401 }
      );
    }

    const fullProfile = await db.getUserByUsername(user.username);
    if (!fullProfile) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'User profile could not be loaded.',
          },
        },
        { status: 404 }
      );
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      isAdmin: Boolean(user.isAdmin),
    });

    const redirectUrl = fullProfile.status === 'published' ? '/dashboard' : '/profile/edit';

    const response = NextResponse.json({
      success: true,
      data: {
        user: sanitizeSessionUser(fullProfile),
        redirectUrl,
      },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to sign in. Please try again later.',
        },
      },
      { status: 500 }
    );
  }
}
