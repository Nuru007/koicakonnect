import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const [stats, categoryStats, countries] = await Promise.all([
      db.getPlatformStats(),
      db.getCategoryStats(),
      db.getCountriesWithCounts(),
    ]);

    const response = NextResponse.json({
      stats,
      categoryStats,
      countries,
    });

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    return response;
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to retrieve stats' }, { status: 500 });
  }
}

