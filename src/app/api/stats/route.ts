import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = db.getPlatformStats();
    const categoryStats = db.getCategoryStats();
    const countries = db.getCountriesWithCounts();

    return NextResponse.json({
      stats,
      categoryStats,
      countries,
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to retrieve stats' }, { status: 500 });
  }
}
