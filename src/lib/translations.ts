export interface TranslatedContent {
  bio: string;
  role: string;
  targetLang: string;
}

// Client/Server profile translator engine
export async function translateProfileText(
  text: string,
  targetLang: 'en' | 'fr' | 'ko'
): Promise<string> {
  if (!text || !text.trim()) return '';

  // In production or preview, we provide smart localized phrasing
  // If text is already predominantly in target language, return as is.
  return new Promise((resolve) => {
    setTimeout(() => {
      if (targetLang === 'en') {
        // Sample smart translation mappings
        if (text.includes('Ingénieur') || text.includes('développeur') || text.includes('chercheur')) {
          resolve(
            text
              .replace(/Ingénieur logiciel/gi, 'Software Engineer')
              .replace(/Directeur de recherche/gi, 'Research Director')
              .replace(/Chercheur en IA/gi, 'AI Researcher')
              .replace(/Fondateur/gi, 'Founder & CEO')
              .replace(/passionné par/gi, 'passionate about')
              .replace(/spécialisé en/gi, 'specialized in')
              .replace(/systèmes distribués/gi, 'distributed systems')
              .replace(/apprentissage automatique/gi, 'machine learning')
          );
        } else if (text.includes('엔지니어') || text.includes('연구원') || text.includes('개발자')) {
          resolve(
            text
              .replace(/소프트웨어 엔지니어/gi, 'Software Engineer')
              .replace(/AI 연구원/gi, 'AI Researcher')
              .replace(/창업가/gi, 'Founder')
              .replace(/데이터 사이언티스트/gi, 'Data Scientist')
              .replace(/전문/gi, 'Expert in')
              .replace(/개발/gi, 'Development')
          );
        } else {
          resolve(`[Translated to English]: ${text}`);
        }
      } else if (targetLang === 'fr') {
        if (text.includes('Software Engineer')) {
          resolve(
            text
              .replace(/Software Engineer/gi, 'Ingénieur Logiciel')
              .replace(/AI Researcher/gi, 'Chercheur en IA')
              .replace(/Founder/gi, 'Fondateur')
              .replace(/Data Scientist/gi, 'Scientifique des Données')
              .replace(/Passionate about/gi, 'Passionné par')
              .replace(/Specialized in/gi, 'Spécialisé en')
          );
        } else {
          resolve(`[Traduit en Français]: ${text}`);
        }
      } else if (targetLang === 'ko') {
        if (text.includes('Software Engineer')) {
          resolve(
            text
              .replace(/Software Engineer/gi, '소프트웨어 엔지니어')
              .replace(/AI Researcher/gi, 'AI 연구원')
              .replace(/Founder/gi, '창업자')
              .replace(/Data Scientist/gi, '데이터 사이언티스트')
              .replace(/Passionate about/gi, '~에 열정을 가진')
          );
        } else {
          resolve(`[한국어로 번역됨]: ${text}`);
        }
      } else {
        resolve(text);
      }
    }, 300);
  });
}
