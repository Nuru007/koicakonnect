import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';
import { User, AuthSession } from '@/lib/types';
import { db } from '@/lib/db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'koicakonnect-super-secret-key-2026-production-secure'
);

export const COOKIE_NAME = 'koicakonnect_session';
export const LEGACY_COOKIE_NAME = 'networth_session';

// --- Password Hashing & Verification ---
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Strong password policy: min 8 chars
export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  if (typeof password !== 'string' || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }
  return { valid: true };
}

// --- Session Token Generation (JWT) ---
export async function createSessionToken(payload: {
  userId: string;
  email: string;
  username: string;
  name: string;
  role: string;
  isAdmin: boolean;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthSession;
  } catch {
    return null;
  }
}

// --- Password Reset Cryptographic Tokens ---
export function generateResetToken(): { rawToken: string; hashedToken: string } {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashResetToken(rawToken);
  return { rawToken, hashedToken };
}

export function hashResetToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

// Safe developer logging (strictly disabled in production)
export function logDevResetLink(email: string, resetUrl: string): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n[DEV-ONLY PASSWORD RESET]`);
    console.log(`Recipient: ${email}`);
    console.log(`Reset URL: ${resetUrl}\n`);
  }
}

// --- Session Retrieval & Verification ---
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value || cookieStore.get(LEGACY_COOKIE_NAME)?.value;
    if (!token) return null;

    const session = await verifySessionToken(token);
    if (!session || !session.userId) return null;

    const user = await db.getUserById(session.userId);
    if (!user || user.isDeactivated) return null;

    return user;
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(req: NextRequest): Promise<AuthSession | null> {
  let token =
    req.cookies.get(COOKIE_NAME)?.value ||
    req.cookies.get(LEGACY_COOKIE_NAME)?.value;

  if (!token) {
    const rawCookie = req.headers.get('cookie') || '';
    const match = rawCookie.match(new RegExp(`(?:^|;\\s*)(?:${COOKIE_NAME}|${LEGACY_COOKIE_NAME})=([^;]+)`));
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    }
  }

  if (!token) return null;
  return verifySessionToken(token);
}

// --- Cookie Manipulators for NextResponse ---
export function setAuthCookie(res: NextResponse, token: string): void {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  res.cookies.set({
    name: LEGACY_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export function getAuthCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === 'production';
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}${
    isProd ? '; Secure' : ''
  }`;
}

export function getClearAuthCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
