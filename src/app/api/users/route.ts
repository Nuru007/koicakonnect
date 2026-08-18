import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SearchFilters } from '@/lib/types';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const session = await getSessionFromRequest(req);

    const query = searchParams.get('q') || undefined;
    
    const categoryParam = searchParams.get('category');
    const categorySlugs = categoryParam ? categoryParam.split(',').map(s => s.trim()).filter(Boolean) : undefined;

    const skillParam = searchParams.get('skill');
    const skillNames = skillParam ? skillParam.split(',').map(s => s.trim()).filter(Boolean) : undefined;

    const interestParam = searchParams.get('interest');
    const interestNames = interestParam ? interestParam.split(',').map(s => s.trim()).filter(Boolean) : undefined;

    const countryParam = searchParams.get('country');
    const countries = countryParam ? countryParam.split(',').map(s => s.trim()).filter(Boolean) : undefined;

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

    // Execute real database query strictly returning published, discoverable, active users
    const results = await db.getPublishedUsers(filters);

    const response = NextResponse.json({
      success: true,
      data: results,
      users: results.users,
      total: results.total,
      page: results.page,
      totalPages: results.totalPages,
    });

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return response;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DISCOVER_FETCH_FAILED',
          message: 'Failed to retrieve discovery results. Please try again.',
        },
      },
      { status: 500 }
    );
  }
}
