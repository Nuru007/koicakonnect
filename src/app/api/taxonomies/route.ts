import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [categories, skills, interests, languages, countriesWithCounts] = await Promise.all([
      db.getCategories(),
      db.getSkills(),
      db.getInterests(),
      db.getLanguages(),
      db.getCountriesWithCounts(),
    ]);

    return NextResponse.json({
      categories,
      skills,
      interests,
      languages,
      countries: countriesWithCounts,
    });
  } catch (error: any) {
    console.error('Error fetching taxonomies:', error);
    return NextResponse.json({ error: 'Failed to retrieve taxonomies' }, { status: 500 });
  }
}
