import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SearchFilters } from '@/lib/types';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get current authenticated user session if present
    const session = await getSessionFromRequest(req);

    const query = searchParams.get('q') || undefined;
    
    // Parse category filters
    const categoryParam = searchParams.get('category');
    const categorySlugs = categoryParam ? categoryParam.split(',').map(s => s.trim()).filter(Boolean) : undefined;

    // Parse skill filters
    const skillParam = searchParams.get('skill');
    const skillNames = skillParam ? skillParam.split(',').map(s => s.trim()).filter(Boolean) : undefined;

    // Parse interest filters
    const interestParam = searchParams.get('interest');
    const interestNames = interestParam ? interestParam.split(',').map(s => s.trim()).filter(Boolean) : undefined;

    // Parse country filters
    const countryParam = searchParams.get('country');
    const countries = countryParam ? countryParam.split(',').map(s => s.trim()).filter(Boolean) : undefined;

    // Parse language filters
    const languageParam = searchParams.get('language');
    const languageCodes = languageParam ? languageParam.split(',').map(s => s.trim()).filter(Boolean) : undefined;

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 10);
    const excludeSelfParam = searchParams.get('excludeSelf');

    const filters: SearchFilters = {
      query,
      categorySlugs,
      skillNames,
      interestNames,
      countries,
      languageCodes,
      excludeUserId: excludeSelfParam === 'true' ? session?.userId : undefined,
      page,
      limit,
    };

    // Execute real database query
    const results = await db.getPublishedUsers(filters);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve discovery results' },
      { status: 500 }
    );
  }
}
