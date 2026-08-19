import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const [categories, skills, interests, languages, countriesWithCounts] = await Promise.all([
      db.getCategories(),
      db.getSkills(),
      db.getInterests(),
      db.getLanguages(),
      db.getCountriesWithCounts(),
    ]);

    const response = NextResponse.json({
      categories,
      skills,
      interests,
      languages,
      countries: countriesWithCounts,
    });

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    return response;
  } catch (error: any) {
    console.error('Error fetching taxonomies:', error);
    return NextResponse.json({ error: 'Failed to retrieve taxonomies' }, { status: 500 });
  }
}

