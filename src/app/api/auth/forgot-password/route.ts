import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logDevResetLink } from '@/lib/auth';
import { rateLimiter } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const rateCheck = await rateLimiter.check(`forgot-pwd:${ip}`, 3, 3600); // 3 attempts per hour
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Too many password reset requests. Please try again in ${rateCheck.retryAfter} seconds.`,
          },
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email address is required',
          },
        },
        { status: 400 }
      );
    }

    const result = await db.createPasswordReset(email.toLowerCase().trim());

    // In development environment, log the reset URL for testing (strictly never in production)
    if (result.rawToken && result.email) {
      const origin = req.headers.get('origin') || 'http://localhost:3000';
      const resetUrl = `${origin}/reset-password?token=${result.rawToken}`;
      logDevResetLink(result.email, resetUrl);
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'If an account exists with this email, a password reset link has been sent.',
      },
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to process password reset request. Please try again later.',
        },
      },
      { status: 500 }
    );
  }
}
