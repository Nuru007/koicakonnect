import crypto from 'crypto';

export type SupportedLanguage = 'en' | 'fr' | 'ko';

/**
 * Computes a deterministic SHA-256 fingerprint of the trimmed text for cache invalidation.
 */
export function computeSourceHash(text: string): string {
  if (!text) return '';
  return crypto
    .createHash('sha256')
    .update(text.trim())
    .digest('hex')
    .substring(0, 16);
}

/**
 * Clean decoded text from HTML entities returned by translation engines.
 */
function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ');
}

/**
 * Google Cloud Translation API (REST v2)
 */
async function translateWithGoogleCloud(
  text: string,
  targetLang: SupportedLanguage,
  sourceLang?: string
): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATION_API_KEY;
  if (!apiKey) throw new Error('NO_GOOGLE_KEY');

  const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;
  const body: any = {
    q: [text],
    target: targetLang,
    format: 'text',
  };
  if (sourceLang && sourceLang !== 'auto') {
    body.source = sourceLang;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Translate Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const translated = data?.data?.translations?.[0]?.translatedText;
  if (!translated) throw new Error('Empty Google translation response');

  return decodeHtmlEntities(translated);
}

/**
 * DeepL API (Free / Pro)
 */
async function translateWithDeepL(
  text: string,
  targetLang: SupportedLanguage,
  sourceLang?: string
): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error('NO_DEEPL_KEY');

  const isFree = apiKey.endsWith(':fx');
  const baseUrl = isFree
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';

  // DeepL target codes: 'EN-US' or 'EN-GB' for English, 'FR' for French, 'KO' for Korean
  const deeplTarget = targetLang === 'en' ? 'EN-US' : targetLang.toUpperCase();

  const formData = new URLSearchParams();
  formData.append('text', text);
  formData.append('target_lang', deeplTarget);
  if (sourceLang && sourceLang !== 'auto') {
    formData.append('source_lang', sourceLang.toUpperCase());
  }

  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`DeepL Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const translated = data?.translations?.[0]?.text;
  if (!translated) throw new Error('Empty DeepL translation response');

  return decodeHtmlEntities(translated);
}

async function translateSingleChunk(
  chunk: string,
  targetLang: SupportedLanguage,
  sourceLang: string = 'en'
): Promise<string> {
  if (!chunk || !chunk.trim()) return '';

  const src = sourceLang.toLowerCase().substring(0, 2);
  const tgt = targetLang.toLowerCase().substring(0, 2);

  if (src === tgt) return chunk;

  try {
    const encoded = encodeURIComponent(chunk.trim());
    const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=${src}|${tgt}`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = await res.json();
      const match = data?.responseData?.translatedText;
      if (
        match &&
        typeof match === 'string' &&
        !match.toUpperCase().includes('MYMEMORY WARNING') &&
        !match.toUpperCase().includes('QUERY LENGTH LIMIT') &&
        !match.toUpperCase().includes('INVALID TARGET LANGUAGE')
      ) {
        return decodeHtmlEntities(match);
      }
    }
  } catch (err) {
    // Silently fall through to fallback
  }

  return fallbackRuleTranslation(chunk, targetLang);
}

/**
 * Resilient Public Translation Engine (MyMemory / LibreTranslate API)
 * Automatically chunks text by paragraphs / sentences to stay within safe query limits.
 */
async function translateWithPublicEngine(
  text: string,
  targetLang: SupportedLanguage,
  sourceLang: string = 'en'
): Promise<string> {
  if (!text || !text.trim()) return '';

  // If text is short (under 400 chars), translate directly
  if (text.length <= 400) {
    return translateSingleChunk(text, targetLang, sourceLang);
  }

  // If text has paragraphs, translate each paragraph separately and preserve layout
  const paragraphs = text.split('\n\n');
  if (paragraphs.length > 1) {
    const translatedParagraphs = await Promise.all(
      paragraphs.map((p) =>
        p.trim() ? translateWithPublicEngine(p, targetLang, sourceLang) : Promise.resolve('')
      )
    );
    return translatedParagraphs.join('\n\n');
  }

  // If single long paragraph, chunk by sentences (full stops)
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [text];
  const translatedSentences: string[] = [];
  let currentBatch = '';

  for (const sentence of sentences) {
    if ((currentBatch + sentence).length < 350) {
      currentBatch += sentence;
    } else {
      if (currentBatch) {
        const trans = await translateSingleChunk(currentBatch, targetLang, sourceLang);
        translatedSentences.push(trans);
      }
      currentBatch = sentence;
    }
  }

  if (currentBatch) {
    const trans = await translateSingleChunk(currentBatch, targetLang, sourceLang);
    translatedSentences.push(trans);
  }

  return translatedSentences.join(' ').trim();
}

/**
 * Professional fallback translator for common fellowship and technical profile vocabulary.
 */
function fallbackRuleTranslation(text: string, targetLang: SupportedLanguage): string {
  if (targetLang === 'fr') {
    return text
      .replace(/Multidisciplinary mechatronics engineer/gi, 'Ingénieure en mécatronique multidisciplinaire')
      .replace(/mechatronics engineer/gi, 'ingénieur(e) en mécatronique')
      .replace(/hands-on experience in robotics assembly/gi, 'expérience pratique dans l’assemblage robotique')
      .replace(/technical documentation/gi, 'la documentation technique')
      .replace(/client pitching/gi, 'la présentation de projets aux clients')
      .replace(/Certified Scrum Master/gi, 'Scrum Master certifiée')
      .replace(/Robotics Education & IoT/gi, 'Éducation en Robotique & IoT')
      .replace(/Certified Design Thinking Facilitator/gi, 'Facilitatrice Certifiée en Design Thinking')
      .replace(/Aspiring Scrum Master/gi, 'Future Scrum Master')
      .replace(/Software Engineer/gi, 'Ingénieur Logiciel')
      .replace(/AI Researcher/gi, 'Chercheur en IA')
      .replace(/Director General/gi, 'Directeur Général')
      .replace(/Economist/gi, 'Économiste')
      .replace(/Founder & CEO/gi, 'Fondateur & PDG')
      .replace(/Data Scientist/gi, 'Scientifique des Données')
      .replace(/Passionate about/gi, 'Passionné(e) par')
      .replace(/Specialized in/gi, 'Spécialisé(e) en')
      .replace(/Open to connecting with professionals/gi, 'Ouvert(e) aux échanges avec des professionnels')
      .replace(/across Africa/gi, 'à travers l’Afrique');
  }

  if (targetLang === 'ko') {
    return text
      .replace(/Multidisciplinary mechatronics engineer/gi, '다학제적 메카트로닉스 엔지니어')
      .replace(/mechatronics engineer/gi, '메카트로닉스 엔지니어')
      .replace(/hands-on experience in robotics assembly/gi, '로봇 조립 및 실무 경험')
      .replace(/technical documentation/gi, '기술 문서 작성')
      .replace(/client pitching/gi, '고객 프레젠테이션 및 피칭')
      .replace(/Certified Scrum Master/gi, '공인 스크럼 마스터 (Certified Scrum Master)')
      .replace(/Robotics Education & IoT/gi, '로봇 교육 및 IoT')
      .replace(/Certified Design Thinking Facilitator/gi, '공인 디자인 씽킹 퍼실리테이터')
      .replace(/Aspiring Scrum Master/gi, '예비 스크럼 마스터')
      .replace(/Software Engineer/gi, '소프트웨어 엔지니어')
      .replace(/AI Researcher/gi, 'AI 연구원')
      .replace(/Director General/gi, '사무총장 / 디렉터')
      .replace(/Economist/gi, '경제학자')
      .replace(/Founder & CEO/gi, '창업자 및 대표')
      .replace(/Data Scientist/gi, '데이터 사이언티스트')
      .replace(/Passionate about/gi, '~에 열정을 가진')
      .replace(/Specialized in/gi, '~을 전문으로 하는')
      .replace(/Open to connecting with professionals/gi, '전문가들과의 교류 및 협력을 환영합니다')
      .replace(/across Africa/gi, '아프리카 전역');
  }

  return text;
}

/**
 * Authoritative Server-Side Translation Function.
 * Prioritizes configured Google Cloud Translation or DeepL API keys.
 * Falls back to resilient public engine if keys are absent or temporarily rate-limited.
 */
export async function translateText(
  text: string,
  targetLang: SupportedLanguage,
  sourceLang: string = 'en'
): Promise<{ translatedText: string; provider: string }> {
  if (!text || !text.trim()) {
    return { translatedText: '', provider: 'none' };
  }

  const src = sourceLang.toLowerCase().substring(0, 2);
  const tgt = targetLang.toLowerCase().substring(0, 2);

  // If source and target language are the same, return as is immediately
  if (src === tgt) {
    return { translatedText: text, provider: 'identity' };
  }

  // 1. Try Google Cloud Translation if key is set
  if (process.env.GOOGLE_TRANSLATION_API_KEY) {
    try {
      const translated = await translateWithGoogleCloud(text, targetLang, sourceLang);
      return { translatedText: translated, provider: 'google' };
    } catch (err: any) {
      console.warn('Google Translate failed, falling back:', err.message);
    }
  }

  // 2. Try DeepL API if key is set
  if (process.env.DEEPL_API_KEY) {
    try {
      const translated = await translateWithDeepL(text, targetLang, sourceLang);
      return { translatedText: translated, provider: 'deepl' };
    } catch (err: any) {
      console.warn('DeepL Translation failed, falling back:', err.message);
    }
  }

  // 3. Fallback to resilient translation engine
  try {
    const translated = await translateWithPublicEngine(text, targetLang, sourceLang);
    return { translatedText: translated, provider: 'engine_fallback' };
  } catch (err) {
    return { translatedText: text, provider: 'original_fallback' };
  }
}

/**
 * Translates a collection of named fields in parallel.
 */
export async function translateFields(
  fields: Record<string, string>,
  targetLang: SupportedLanguage,
  sourceLang: string = 'en'
): Promise<Record<string, { translatedText: string; sourceHash: string; provider: string }>> {
  const result: Record<string, { translatedText: string; sourceHash: string; provider: string }> = {};

  const entries = Object.entries(fields).filter(([_, val]) => Boolean(val && val.trim()));

  await Promise.all(
    entries.map(async ([fieldKey, rawText]) => {
      const sourceHash = computeSourceHash(rawText);
      const { translatedText, provider } = await translateText(rawText, targetLang, sourceLang);
      result[fieldKey] = {
        translatedText: translatedText || rawText,
        sourceHash,
        provider,
      };
    })
  );

  return result;
}
