export type SupportedLanguage = 'en' | 'fr' | 'ko';

export interface TaxonomyTranslationEntry {
  en: string;
  fr: string;
  ko: string;
}

// Complete localized display dictionary for predefined system categories
export const CATEGORY_TRANSLATIONS: Record<string, TaxonomyTranslationEntry> = {
  'Technology': { en: 'Technology', fr: 'Technologie', ko: '기술' },
  'Healthcare': { en: 'Healthcare', fr: 'Santé', ko: '보건의료' },
  'Engineering': { en: 'Engineering', fr: 'Ingénierie', ko: '엔지니어링' },
  'Finance': { en: 'Finance', fr: 'Finance', ko: '금융' },
  'Education': { en: 'Education', fr: 'Éducation', ko: '교육' },
  'Logistics': { en: 'Logistics', fr: 'Logistique', ko: '물류' },
  'Research': { en: 'Research', fr: 'Recherche', ko: '연구' },
  'Entrepreneurship': { en: 'Entrepreneurship', fr: 'Entrepreneuriat', ko: '창업' },
  'Agriculture': { en: 'Agriculture', fr: 'Agriculture', ko: '농업' },
  'Energy': { en: 'Energy', fr: 'Énergie', ko: '에너지' },
  'Manufacturing': { en: 'Manufacturing', fr: 'Fabrication & Industrie', ko: '제조업' },
  'Telecommunications': { en: 'Telecommunications', fr: 'Télécommunications', ko: '통신' },
  'Media & Creative': { en: 'Media & Creative', fr: 'Médias & Création', ko: '미디어 및 크리에이티브' },
  'Government': { en: 'Government', fr: 'Gouvernance & Secteur Public', ko: '공공 및 행정' },
  'Other': { en: 'Other', fr: 'Autre', ko: '기타' },
};

// Complete localized display dictionary for predefined system skills
export const SKILL_TRANSLATIONS: Record<string, TaxonomyTranslationEntry> = {
  'Python': { en: 'Python', fr: 'Python', ko: 'Python' },
  'Machine Learning': { en: 'Machine Learning', fr: 'Apprentissage automatique', ko: '머신러닝' },
  'Artificial Intelligence': { en: 'Artificial Intelligence', fr: 'Intelligence artificielle', ko: '인공지능' },
  'AI and Machine Learning': { en: 'AI and Machine Learning', fr: 'IA et Apprentissage automatique', ko: 'AI 및 머신러닝' },
  'Robotics': { en: 'Robotics', fr: 'Robotique', ko: '로봇공학' },
  'PCB Design': { en: 'PCB Design', fr: 'Conception de PCB', ko: 'PCB 설계' },
  'Embedded Systems': { en: 'Embedded Systems', fr: 'Systèmes embarqués', ko: '임베디드 시스템' },
  'Product Management': { en: 'Product Management', fr: 'Gestion de produit', ko: '제품 관리' },
  'Data Science': { en: 'Data Science', fr: 'Science des données', ko: '데이터 사이언스' },
  'Hardware Engineering': { en: 'Hardware Engineering', fr: 'Ingénierie matérielle', ko: '하드웨어 엔지니어링' },
  'TypeScript': { en: 'TypeScript', fr: 'TypeScript', ko: 'TypeScript' },
  'React': { en: 'React', fr: 'React', ko: 'React' },
  'Next.js': { en: 'Next.js', fr: 'Next.js', ko: 'Next.js' },
  'Rust': { en: 'Rust', fr: 'Rust', ko: 'Rust' },
  'Go': { en: 'Go', fr: 'Go', ko: 'Go' },
  'Kubernetes': { en: 'Kubernetes', fr: 'Kubernetes', ko: 'Kubernetes' },
  'Cloud Architecture': { en: 'Cloud Architecture', fr: 'Architecture Cloud', ko: '클라우드 아키텍처' },
  'Deep Learning': { en: 'Deep Learning', fr: 'Apprentissage profond (Deep Learning)', ko: '딥러닝' },
  'Computer Vision': { en: 'Computer Vision', fr: 'Vision par ordinateur', ko: '컴퓨터 비전' },
  'NLP': { en: 'NLP', fr: 'Traitement du langage naturel (NLP)', ko: '자연어 처리 (NLP)' },
  'Bioinformatics': { en: 'Bioinformatics', fr: 'Bio-informatique', ko: '생물정보학' },
  'Quantum Computing': { en: 'Quantum Computing', fr: 'Informatique quantique', ko: '양자 컴퓨팅' },
  'Cybersecurity': { en: 'Cybersecurity', fr: 'Cybersécurité', ko: '사이버 보안' },
  'Solidity': { en: 'Solidity', fr: 'Solidity', ko: 'Solidity' },
  'FPGA': { en: 'FPGA', fr: 'FPGA', ko: 'FPGA' },
  'UI/UX Design': { en: 'UI/UX Design', fr: 'Design UI/UX', ko: 'UI/UX 디자인' },
  'Systems Architecture': { en: 'Systems Architecture', fr: 'Architecture des systèmes', ko: '시스템 아키텍처' },
  'Qiskit': { en: 'Qiskit', fr: 'Qiskit', ko: 'Qiskit' },
  'C++': { en: 'C++', fr: 'C++', ko: 'C++' },
  'ROS2': { en: 'ROS2', fr: 'ROS2', ko: 'ROS2' },
  '5G Core': { en: '5G Core', fr: 'Cœur 5G', ko: '5G 코어' },
  'Fiber Optics': { en: 'Fiber Optics', fr: 'Fibre optique', ko: '광통신 (광섬유)' },
  'Algorithms': { en: 'Algorithms', fr: 'Algorithmes', ko: '알고리즘' },
  'Computational Theory': { en: 'Computational Theory', fr: 'Théorie du calcul', ko: '계산 이론' },
  'Cryptanalysis': { en: 'Cryptanalysis', fr: 'Cryptanalyse', ko: '암호 분석' },
  'Logic Systems': { en: 'Logic Systems', fr: 'Systèmes logiques', ko: '논리 시스템' },
  'Project Management': { en: 'Project Management', fr: 'Gestion de projet', ko: '프로젝트 관리' },
  'Business  Development': { en: 'Business Development', fr: 'Développement commercial', ko: '비즈니스 개발' },
  'Strategy Building': { en: 'Strategy Building', fr: 'Élaboration de stratégie', ko: '전략 수립' },
  'Operations management': { en: 'Operations Management', fr: 'Gestion des opérations', ko: '운영 관리' },
  '3D modeling': { en: '3D Modeling', fr: 'Modélisation 3D', ko: '3D 모델링' },
  'Prototyping': { en: 'Prototyping', fr: 'Prototypage', ko: '프로토타이핑' },
  'AutoCAD': { en: 'AutoCAD', fr: 'AutoCAD', ko: 'AutoCAD' },
  'ETAP': { en: 'ETAP', fr: 'ETAP', ko: 'ETAP' },
  'MS Office Packages': { en: 'MS Office Packages', fr: 'Suite MS Office', ko: 'MS 오피스 패키지' },
  'digital marketing': { en: 'Digital Marketing', fr: 'Marketing numérique', ko: '디지털 마케팅' },
  'Graphic Design': { en: 'Graphic Design', fr: 'Design graphique', ko: '그래픽 디자인' },
  'Videography': { en: 'Videography', fr: 'Vidéographie', ko: '영상 제작' },
  'Photography': { en: 'Photography', fr: 'Photographie', ko: '사진 촬영' },
  'Social Media Management': { en: 'Social Media Management', fr: 'Gestion des réseaux sociaux', ko: '소셜 미디어 관리' },
  'Prompt Engineering': { en: 'Prompt Engineering', fr: 'Ingénierie de prompts', ko: '프롬프트 엔지니어링' },
  'Community Management': { en: 'Community Management', fr: 'Animation de communauté', ko: '커뮤니티 관리' },
  'Logistics Management': { en: 'Logistics Management', fr: 'Gestion logistique', ko: '물류 관리' },
  'Instructor': { en: 'Instructor / Trainer', fr: 'Instructeur / Formateur', ko: '강사 및 교육' },
  'Drone Operations & Piloting': { en: 'Drone Operations & Piloting', fr: 'Pilotage & Opérations de drones', ko: '드론 운용 및 조종' },
  'Agricultural Drone Technology': { en: 'Agricultural Drone Technology', fr: 'Drones agricoles', ko: '농업용 드론 기술' },
  'one Mapping & Surveying': { en: 'Drone Mapping & Surveying', fr: 'Cartographie & Topographie par drone', ko: '드론 맵핑 및 측량' },
  'Team Leadership & Management': { en: 'Team Leadership & Management', fr: 'Leadership et Gestion d’équipe', ko: '팀 리더십 및 조직 관리' },
  'Youth Training & Capacity Building': { en: 'Youth Training & Capacity Building', fr: 'Formation des jeunes et Renforcement des capacités', ko: '청년 교육 및 역량 강화' },
  'Multispectral Imaging & Vegetation Analysis': { en: 'Multispectral Imaging & Vegetation Analysis', fr: 'Imagerie multispectrale et Analyse de la végétation', ko: '다중분광 영상 및 식생 분석' },
  'International Policy Analysis': { en: 'International Policy Analysis', fr: 'Analyse des politiques internationales', ko: '국제 정책 분석' },
  'Public Health Strategy': { en: 'Public Health Strategy', fr: 'Stratégie de santé publique', ko: '공중보건 전략' },
  'Educational Technology': { en: 'Educational Technology', fr: 'Technologies éducatives (EdTech)', ko: '교육 기술 (EdTech)' },
  'Program Management': { en: 'Program Management', fr: 'Gestion de programme', ko: '프로그램 관리' },
  'Design thinking': { en: 'Design Thinking', fr: 'Design Thinking', ko: '디자인 씽킹' },
  'scrum': { en: 'Scrum / Agile', fr: 'Scrum / Méthodes Agiles', ko: '스크럼 / 애자일' },
};

// Complete localized display dictionary for predefined system interests
export const INTEREST_TRANSLATIONS: Record<string, TaxonomyTranslationEntry> = {
  'Artificial Intelligence': { en: 'Artificial Intelligence', fr: 'Intelligence artificielle', ko: '인공지능' },
  'Healthcare Technology': { en: 'Healthcare Technology', fr: 'Technologies de la santé', ko: '헬스케어 기술' },
  'Semiconductor Technology': { en: 'Semiconductor Technology', fr: 'Technologie des semi-conducteurs', ko: '반도체 기술' },
  'Medical Devices': { en: 'Medical Devices', fr: 'Dispositifs médicaux', ko: '의료 기기' },
  'Robotics': { en: 'Robotics', fr: 'Robotique', ko: '로봇공학' },
  'Climate Technology': { en: 'Climate Technology', fr: 'Technologies pour le climat', ko: '기후 기술' },
  'FinTech': { en: 'FinTech', fr: 'FinTech (Technologies financières)', ko: '핀테크' },
  'Space Exploration': { en: 'Space Exploration', fr: 'Exploration spatiale', ko: '우주 탐사' },
  'Autonomous Vehicles': { en: 'Autonomous Vehicles', fr: 'Véhicules autonomes', ko: '자율주행 차량' },
  'Synthetic Biology': { en: 'Synthetic Biology', fr: 'Biologie synthétique', ko: '합성생물학' },
  'Quantum Information': { en: 'Quantum Information', fr: 'Information quantique', ko: '양자 정보학' },
  'Clean Energy': { en: 'Clean Energy', fr: 'Énergie propre', ko: '청정 에너지' },
  'Human-Computer Interaction': { en: 'Human-Computer Interaction', fr: 'Interaction homme-machine', ko: '인간-컴퓨터 상호작용' },
  'Decentralized Systems': { en: 'Decentralized Systems', fr: 'Systèmes décentralisés (Web3)', ko: '탈중앙화 시스템' },
  'Neurotechnology': { en: 'Neurotechnology', fr: 'Neurotechnologie', ko: '신경기술 (뉴로테크)' },
  'Quantum Computing': { en: 'Quantum Computing', fr: 'Informatique quantique', ko: '양자 컴퓨팅' },
  'Satellite Systems': { en: 'Satellite Systems', fr: 'Systèmes satellitaires', ko: '위성 시스템' },
  'Mental Health Awareness': { en: 'Mental Health Awareness', fr: 'Sensibilisation à la santé mentale', ko: '정신건강 인식 개선' },
  'Automation': { en: 'Automation', fr: 'Automatisation', ko: '자동화' },
  'AI content creation': { en: 'AI Content Creation', fr: 'Création de contenu assistée par IA', ko: 'AI 콘텐츠 제작' },
  'Edtech solution': { en: 'EdTech Solutions', fr: 'Solutions EdTech (Éducation)', ko: '에듀테크 솔루션' },
  'Precision Agriculture & Smart Farming': { en: 'Precision Agriculture & Smart Farming', fr: 'Agriculture de précision et Fermes intelligentes', ko: '정밀 농업 및 스마트 팜' },
  'Technology for Social & Economic Development': { en: 'Technology for Social & Economic Development', fr: 'Technologie pour le développement socio-économique', ko: '사회·경제 발전을 위한 기술' },
  'Youth Empowerment & Skills Development': { en: 'Youth Empowerment & Skills Development', fr: 'Autonomisation des jeunes et Développement des compétences', ko: '청년 역량 강화 및 기술 교육' },
  'AgriTech & Digital Transformation': { en: 'AgriTech & Digital Transformation', fr: 'AgriTech et Transformation numérique', ko: '애그리테크 및 디지털 전환' },
  'Renewable Energy Systems': { en: 'Renewable Energy Systems', fr: 'Systèmes d’énergie renouvelable', ko: '신재생 에너지 시스템' },
  'Digital Health': { en: 'Digital Health', fr: 'Santé numérique (e-Santé)', ko: '디지털 헬스케어' },
  'Youth Mentorship': { en: 'Youth Mentorship', fr: 'Mentorat des jeunes', ko: '청년 멘토링' },
  'Global Development': { en: 'Global Development', fr: 'Développement international', ko: '국제 개발 협력' },
};

function normalizeLookupKey(key: string): string {
  return key.trim().toLowerCase();
}

// Localized helper for category names
export function getLocalizedCategoryName(name: string, lang: string): string {
  if (!name || !name.trim()) return '';
  if (lang === 'en') return name;

  const targetLang = (lang === 'fr' || lang === 'ko' ? lang : 'en') as SupportedLanguage;
  const match = Object.entries(CATEGORY_TRANSLATIONS).find(
    ([k]) => normalizeLookupKey(k) === normalizeLookupKey(name)
  );

  return match ? match[1][targetLang] || name : name;
}

// Localized helper for skill names
export function getLocalizedSkillName(name: string, lang: string): string {
  if (!name || !name.trim()) return '';
  if (lang === 'en') return name;

  const targetLang = (lang === 'fr' || lang === 'ko' ? lang : 'en') as SupportedLanguage;
  const match = Object.entries(SKILL_TRANSLATIONS).find(
    ([k]) => normalizeLookupKey(k) === normalizeLookupKey(name)
  );

  return match ? match[1][targetLang] || name : name;
}

// Localized helper for interest names
export function getLocalizedInterestName(name: string, lang: string): string {
  if (!name || !name.trim()) return '';
  if (lang === 'en') return name;

  const targetLang = (lang === 'fr' || lang === 'ko' ? lang : 'en') as SupportedLanguage;
  const match = Object.entries(INTEREST_TRANSLATIONS).find(
    ([k]) => normalizeLookupKey(k) === normalizeLookupKey(name)
  );

  return match ? match[1][targetLang] || name : name;
}
