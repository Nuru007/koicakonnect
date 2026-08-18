import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = db.getCategories();
    const skills = db.getSkills();
    const interests = db.getInterests();
    const languages = db.getLanguages();
    const countriesWithCounts = db.getCountriesWithCounts();

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
