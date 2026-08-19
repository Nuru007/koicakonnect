import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { translateFields, computeSourceHash, SupportedLanguage } from '@/lib/translation-service';
import { SKILL_TRANSLATIONS, INTEREST_TRANSLATIONS } from '@/lib/taxonomy-translations';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  return handleTranslationRequest(req);
}

export async function POST(req: NextRequest) {
  return handleTranslationRequest(req);
}

async function handleTranslationRequest(req: NextRequest) {
  try {
    let username: string | null = null;
    let targetLangParam: string | null = null;

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      username = body.username;
      targetLangParam = body.lang || body.targetLang;
    } else {
      const { searchParams } = new URL(req.url);
      username = searchParams.get('username');
      targetLangParam = searchParams.get('lang') || searchParams.get('targetLang');
    }

    if (!username || !username.trim()) {
      return NextResponse.json(
        { success: false, error: { message: 'Username parameter is required' } },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const targetLang = (targetLangParam?.toLowerCase() || 'en') as SupportedLanguage;

    if (!['en', 'fr', 'ko'].includes(targetLang)) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid target language. Supported: en, fr, ko' } },
        { status: 400 }
      );
    }

    // 1. Fetch published profile by username from database
    const session = await getSessionFromRequest(req);
    let profile = await db.getPublicProfileByUsername(cleanUsername);

    // Allow profile owner to preview draft translations
    if (!profile && session?.userId) {
      const selfProfile = await db.getUserByUsername(cleanUsername);
      if (selfProfile && (selfProfile.id === session.userId || selfProfile.isAdmin)) {
        profile = selfProfile;
      }
    }

    if (!profile) {
      return NextResponse.json(
        { success: false, error: { message: 'Profile not found or unpublished' } },
        { status: 404 }
      );
    }

    const sourceLang = (profile.preferredLanguage?.toLowerCase() || 'en') as SupportedLanguage;

    // 2. Instant Identity Return if target language matches original content language
    if (targetLang === sourceLang) {
      return NextResponse.json({
        success: true,
        data: {
          username: profile.username,
          originalLanguage: sourceLang,
          targetLanguage: targetLang,
          translations: {
            bio: profile.bio || '',
            role: profile.role || '',
            organisation: profile.organisation || '',
          },
          fromCache: true,
          provider: 'identity',
        },
      });
    }

    // 3. Identify all Dynamic User-Generated Content (UGC) fields to translate
    const ugcFields: Record<string, string> = {};

    if (profile.bio && profile.bio.trim()) {
      ugcFields['bio'] = profile.bio;
    }
    if (profile.role && profile.role.trim()) {
      ugcFields['role'] = profile.role;
    }
    if (profile.organisation && profile.organisation.trim()) {
      ugcFields['organisation'] = profile.organisation;
    }

    // Identify custom user skills (skills not present in system taxonomy)
    if (profile.skills && profile.skills.length > 0) {
      for (const s of profile.skills) {
        const isStandard = Object.keys(SKILL_TRANSLATIONS).some(
          (k) => k.toLowerCase() === s.name.trim().toLowerCase()
        );
        if (!isStandard && s.name.trim()) {
          ugcFields[`custom_skill:${s.name.trim()}`] = s.name.trim();
        }
      }
    }

    // Identify custom user interests (interests not present in system taxonomy)
    if (profile.interests && profile.interests.length > 0) {
      for (const int of profile.interests) {
        const isStandard = Object.keys(INTEREST_TRANSLATIONS).some(
          (k) => k.toLowerCase() === int.name.trim().toLowerCase()
        );
        if (!isStandard && int.name.trim()) {
          ugcFields[`custom_interest:${int.name.trim()}`] = int.name.trim();
        }
      }
    }

    // 4. Check Supabase `profile_translations` cache for this user and language
    const cachedTranslations = await db.getFieldTranslations(profile.id, targetLang);

    const finalTranslations: Record<string, string> = {};
    const fieldsToTranslate: Record<string, string> = {};
    let cachedCount = 0;

    for (const [fieldKey, rawText] of Object.entries(ugcFields)) {
      const currentHash = computeSourceHash(rawText);
      const cached = cachedTranslations[fieldKey];

      if (cached && cached.sourceHash === currentHash && cached.translatedText) {
        finalTranslations[fieldKey] = cached.translatedText;
        cachedCount++;
      } else {
        // Cache miss or stale content hash -> needs translation
        fieldsToTranslate[fieldKey] = rawText;
      }
    }

    // 5. Authoritative Translation API call for cache misses
    let newlyTranslatedCount = 0;
    if (Object.keys(fieldsToTranslate).length > 0) {
      const translatedBatch = await translateFields(fieldsToTranslate, targetLang, sourceLang);
      const recordsToUpsert: Array<{
        userId: string;
        field: string;
        language: string;
        translatedText: string;
        sourceHash: string;
      }> = [];

      for (const [fieldKey, res] of Object.entries(translatedBatch)) {
        finalTranslations[fieldKey] = res.translatedText;
        recordsToUpsert.push({
          userId: profile.id,
          field: fieldKey,
          language: targetLang,
          translatedText: res.translatedText,
          sourceHash: res.sourceHash,
        });
        newlyTranslatedCount++;
      }

      // Save newly translated fields to Supabase cache in the background
      await db.upsertFieldTranslations(recordsToUpsert);
    }

    const response = NextResponse.json({
      success: true,
      data: {
        username: profile.username,
        originalLanguage: sourceLang,
        targetLanguage: targetLang,
        translations: finalTranslations,
        cachedFieldCount: cachedCount,
        translatedFieldCount: newlyTranslatedCount,
      },
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return response;
  } catch (error: any) {
    console.error('Error in profile translation endpoint:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to translate profile' } },
      { status: 500 }
    );
  }
}
