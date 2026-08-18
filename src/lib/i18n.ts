export type LanguageCode = 'en' | 'fr' | 'ko';

export interface Translations {
  nav: {
    brand: string;
    discover: string;
    categories: string;
    countries: string;
    signIn: string;
    createProfile: string;
    myProfile: string;
    dashboard: string;
    qrCode: string;
    signOut: string;
    settings: string;
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    discoverBtn: string;
    createProfileBtn: string;
    exploreCategories: string;
    exploreCategoriesSubtitle: string;
    howItWorksTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    recentlyJoinedTitle: string;
    recentlyJoinedSubtitle: string;
    emptyPlatformTitle: string;
    emptyPlatformDesc: string;
    emptyPlatformCta: string;
  };
  discover: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterButton: string;
    clearFilters: string;
    categories: string;
    skills: string;
    interests: string;
    country: string;
    language: string;
    allCategories: string;
    allCountries: string;
    allLanguages: string;
    resultsFound: string;
    noResultsTitle: string;
    noResultsDesc: string;
    emptyNetworkTitle: string;
    emptyNetworkDesc: string;
    createProfileCta: string;
    viewProfile: string;
  };
  profile: {
    viewLinkedIn: string;
    personalWebsite: string;
    github: string;
    portfolio: string;
    skillsTitle: string;
    interestsTitle: string;
    categoriesTitle: string;
    languagesTitle: string;
    aboutTitle: string;
    qrTitle: string;
    qrDesc: string;
    downloadQr: string;
    copyLink: string;
    copied: string;
    translateTitle: string;
    translateTo: string;
    originalLanguage: string;
    translating: string;
    translatedBadge: string;
    resetTranslation: string;
    notFoundTitle: string;
    notFoundDesc: string;
    backToDiscover: string;
  };
  dashboard: {
    welcome: string;
    completenessTitle: string;
    completenessTip: string;
    statusTitle: string;
    statusPublished: string;
    statusDraft: string;
    statusPrivate: string;
    publishNow: string;
    unpublish: string;
    viewPublicProfile: string;
    editProfile: string;
    qrCodeCard: string;
    publicUrl: string;
  };
  qrPage: {
    title: string;
    subtitle: string;
    downloadPng: string;
    downloadSvg: string;
    copyUrl: string;
    shareTitle: string;
    useCasesTitle: string;
    useCase1: string;
    useCase2: string;
    useCase3: string;
    useCase4: string;
  };
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    nav: {
      brand: 'KoicaKonnect',
      discover: 'Discover',
      categories: 'Categories',
      countries: 'Countries',
      signIn: 'Sign In',
      createProfile: 'Create Profile',
      myProfile: 'My Profile',
      dashboard: 'Dashboard',
      qrCode: 'QR Card',
      signOut: 'Sign Out',
      settings: 'Settings',
    },
    home: {
      heroBadge: 'People Discovery & Professional Identity',
      heroTitle: 'Discover the people behind the possibilities.',
      heroSubtitle: 'Find professionals, researchers, entrepreneurs, creatives and experts based on what they do, what they know and where they are.',
      searchPlaceholder: 'Search people, skills, industries or interests...',
      discoverBtn: 'Discover People',
      createProfileBtn: 'Create Your Profile',
      exploreCategories: 'Explore by Industry & Field',
      exploreCategoriesSubtitle: 'Connect with experts across global disciplines and sectors',
      howItWorksTitle: 'How KoicaKonnect Works',
      step1Title: '1. Discover',
      step1Desc: 'Search professionals across specific skills, specialized domains, and global locations without social noise.',
      step2Title: '2. Understand',
      step2Desc: 'Inspect real capabilities, active interests, and verified industry categories before reaching out.',
      step3Title: '3. Connect',
      step3Desc: 'Hop directly to their LinkedIn, GitHub, or personal portfolio to initiate authentic professional relationships.',
      recentlyJoinedTitle: 'Recently Joined',
      recentlyJoinedSubtitle: 'Newly published profiles ready to be discovered',
      emptyPlatformTitle: 'Your network starts here.',
      emptyPlatformDesc: 'Be one of the first people to make your expertise and capabilities discoverable worldwide.',
      emptyPlatformCta: 'Create Your Profile',
    },
    discover: {
      title: 'Discover People',
      subtitle: 'Find people based on their skills, interests, expertise and location.',
      searchPlaceholder: 'Search people, skills, industries or interests...',
      filterButton: 'Filters',
      clearFilters: 'Clear Filters',
      categories: 'Categories',
      skills: 'Skills',
      interests: 'Areas of Interest',
      country: 'Country',
      language: 'Language',
      allCategories: 'All Categories',
      allCountries: 'All Countries',
      allLanguages: 'All Languages',
      resultsFound: 'people found',
      noResultsTitle: 'No people found',
      noResultsDesc: "We couldn't find anyone matching those criteria. Try adjusting your search or clearing some filters.",
      emptyNetworkTitle: 'The network is just getting started.',
      emptyNetworkDesc: 'People will appear here as they create and publish their KoicaKonnect profiles. Be among the first to showcase your expertise.',
      createProfileCta: 'Create Your Profile',
      viewProfile: 'View Profile',
    },
    profile: {
      viewLinkedIn: 'View LinkedIn Profile',
      personalWebsite: 'Personal Website',
      github: 'GitHub Profile',
      portfolio: 'Portfolio',
      skillsTitle: 'Skills & Capabilities',
      interestsTitle: 'Areas of Interest',
      categoriesTitle: 'Industry Categories',
      languagesTitle: 'Languages',
      aboutTitle: 'About & Professional Bio',
      qrTitle: 'Professional Identity QR',
      qrDesc: 'Scan this code to instantly access this KoicaKonnect profile.',
      downloadQr: 'Download QR',
      copyLink: 'Copy Profile Link',
      copied: 'Copied to Clipboard!',
      translateTitle: 'Language Translation',
      translateTo: 'Translate to',
      originalLanguage: 'Original',
      translating: 'Translating...',
      translatedBadge: 'Translated',
      resetTranslation: 'Show Original',
      notFoundTitle: 'Profile Not Found',
      notFoundDesc: 'The user profile you are looking for does not exist or has not been published yet.',
      backToDiscover: 'Back to Discover',
    },
    dashboard: {
      welcome: 'Welcome back',
      completenessTitle: 'Profile Completeness',
      completenessTip: 'Add more skills and external links to improve your discoverability.',
      statusTitle: 'Profile Visibility',
      statusPublished: 'Published & Public',
      statusDraft: 'Draft (Hidden)',
      statusPrivate: 'Private',
      publishNow: 'Publish Profile',
      unpublish: 'Unpublish to Draft',
      viewPublicProfile: 'View Public Profile',
      editProfile: 'Edit Profile',
      qrCodeCard: 'Your KoicaKonnect QR Card',
      publicUrl: 'Your Public Profile URL',
    },
    qrPage: {
      title: 'Your KoicaKonnect QR Code',
      subtitle: 'Share your professional identity anywhere. Anyone can scan this code to view your KoicaKonnect profile.',
      downloadPng: 'Download PNG Card',
      downloadSvg: 'Download SVG',
      copyUrl: 'Copy Profile Link',
      shareTitle: 'Digital Identity Card',
      useCasesTitle: 'Real-World Use Cases',
      useCase1: 'Conference badges & event meetups',
      useCase2: 'Business cards & CV / Resumes',
      useCase3: 'Presentation slides & speaking decks',
      useCase4: 'Email signatures & personal portfolio websites',
    },
  },
  fr: {
    nav: {
      brand: 'KoicaKonnect',
      discover: 'Découvrir',
      categories: 'Catégories',
      countries: 'Pays',
      signIn: 'Connexion',
      createProfile: 'Créer un profil',
      myProfile: 'Mon Profil',
      dashboard: 'Tableau de bord',
      qrCode: 'Carte QR',
      signOut: 'Déconnexion',
      settings: 'Paramètres',
    },
    home: {
      heroBadge: 'Découverte de talents & Identité Professionnelle',
      heroTitle: 'Découvrez les talents derrière les opportunités.',
      heroSubtitle: 'Trouvez des professionnels, chercheurs, entrepreneurs et experts selon leurs compétences, leurs savoirs et leur localisation.',
      searchPlaceholder: 'Rechercher des personnes, compétences, secteurs ou intérêts...',
      discoverBtn: 'Découvrir des personnes',
      createProfileBtn: 'Créer votre profil',
      exploreCategories: 'Explorer par Secteur & Domaine',
      exploreCategoriesSubtitle: 'Connectez-vous avec des experts dans toutes les disciplines mondiales',
      howItWorksTitle: 'Comment fonctionne KoicaKonnect',
      step1Title: '1. Découvrir',
      step1Desc: 'Trouvez des professionnels par compétences précises sans le bruit des réseaux sociaux traditionnels.',
      step2Title: '2. Comprendre',
      step2Desc: 'Explorez leurs véritables compétences, centres d’intérêt et catégories industrielles vérifiées.',
      step3Title: '3. Connecter',
      step3Desc: 'Accédez directement à leur LinkedIn, GitHub ou portfolio pour initier un contact professionnel pertinent.',
      recentlyJoinedTitle: 'Récemment Inscrits',
      recentlyJoinedSubtitle: 'Profils récemment publiés prêts à être découverts',
      emptyPlatformTitle: 'Votre réseau commence ici.',
      emptyPlatformDesc: 'Soyez parmi les premiers à rendre votre expertise visible à l’échelle mondiale.',
      emptyPlatformCta: 'Créer Votre Profil',
    },
    discover: {
      title: 'Découvrir des Personnes',
      subtitle: 'Trouvez des personnes selon leurs compétences, intérêts, expertises et localisations.',
      searchPlaceholder: 'Rechercher des personnes, compétences, secteurs...',
      filterButton: 'Filtres',
      clearFilters: 'Effacer les filtres',
      categories: 'Catégories',
      skills: 'Compétences',
      interests: 'Centres d’intérêt',
      country: 'Pays',
      language: 'Langue',
      allCategories: 'Toutes les catégories',
      allCountries: 'Tous les pays',
      allLanguages: 'Toutes les langues',
      resultsFound: 'personnes trouvées',
      noResultsTitle: 'Aucune personne trouvée',
      noResultsDesc: "Nous n'avons trouvé personne correspondant à ces critères. Essayez d'ajuster vos filtres.",
      emptyNetworkTitle: 'Le réseau vient tout juste de démarrer.',
      emptyNetworkDesc: 'Les profils apparaîtront ici au fur et à mesure de leur création et publication.',
      createProfileCta: 'Créer votre profil',
      viewProfile: 'Voir le profil',
    },
    profile: {
      viewLinkedIn: 'Voir le Profil LinkedIn',
      personalWebsite: 'Site Personnel',
      github: 'Profil GitHub',
      portfolio: 'Portfolio',
      skillsTitle: 'Compétences & Savoir-faire',
      interestsTitle: 'Centres d’intérêt',
      categoriesTitle: 'Secteurs d’activité',
      languagesTitle: 'Langues',
      aboutTitle: 'À propos & Bio professionnelle',
      qrTitle: 'QR Code d’Identité Professionnelle',
      qrDesc: 'Scannez ce code pour accéder instantanément à ce profil KoicaKonnect.',
      downloadQr: 'Télécharger le QR',
      copyLink: 'Copier le lien',
      copied: 'Lien copié !',
      translateTitle: 'Traduction linguistique',
      translateTo: 'Traduire en',
      originalLanguage: 'Original',
      translating: 'Traduction en cours...',
      translatedBadge: 'Traduit',
      resetTranslation: 'Voir l’original',
      notFoundTitle: 'Profil Introuvable',
      notFoundDesc: 'Le profil que vous recherchez n’existe pas ou n’a pas encore été publié.',
      backToDiscover: 'Retour à Découvrir',
    },
    dashboard: {
      welcome: 'Bienvenue',
      completenessTitle: 'Complétude du Profil',
      completenessTip: 'Ajoutez plus de compétences et de liens externes pour améliorer votre visibilité.',
      statusTitle: 'Visibilité du Profil',
      statusPublished: 'Publié & Public',
      statusDraft: 'Brouillon (Masqué)',
      statusPrivate: 'Privé',
      publishNow: 'Publier le Profil',
      unpublish: 'Repasser en Brouillon',
      viewPublicProfile: 'Voir le Profil Public',
      editProfile: 'Modifier le Profil',
      qrCodeCard: 'Votre Carte QR KoicaKonnect',
      publicUrl: 'Votre URL de Profil Public',
    },
    qrPage: {
      title: 'Votre QR Code KoicaKonnect',
      subtitle: 'Partagez votre identité professionnelle n’importe où. Scannez pour voir le profil.',
      downloadPng: 'Télécharger la carte PNG',
      downloadSvg: 'Télécharger en SVG',
      copyUrl: 'Copier le lien du profil',
      shareTitle: 'Carte d’Identité Numérique',
      useCasesTitle: 'Cas d’Usage Concrets',
      useCase1: 'Badges de conférence et rencontres professionnelles',
      useCase2: 'Cartes de visite & CV',
      useCase3: 'Présentations et diapositives de conférences',
      useCase4: 'Signatures d’e-mails & sites web personnels',
    },
  },
  ko: {
    nav: {
      brand: 'KoicaKonnect',
      discover: '탐색 (Discover)',
      categories: '카테고리',
      countries: '국가별 탐색',
      signIn: '로그인',
      createProfile: '프로필 생성',
      myProfile: '내 프로필',
      dashboard: '대시보드',
      qrCode: 'QR 아이덴티티',
      signOut: '로그아웃',
      settings: '설정',
    },
    home: {
      heroBadge: '인재 탐색 및 글로벌 프로페셔널 아이덴티티',
      heroTitle: '가능성을 만드는 사람들을 발견하세요.',
      heroSubtitle: '역량, 전문 지식, 관심 분야 및 위치를 기반으로 전 세계 전문가, 연구자, 창업가 및 전문가를 탐색하세요.',
      searchPlaceholder: '사람, 기술, 산업 또는 관심 분야 검색...',
      discoverBtn: '인재 탐색하기',
      createProfileBtn: '내 프로필 만들기',
      exploreCategories: '산업 및 전문 분야별 탐색',
      exploreCategoriesSubtitle: '다양한 글로벌 분야의 전문가들과 연결되세요',
      howItWorksTitle: 'KoicaKonnect 작동 방식',
      step1Title: '1. 탐색 (Discover)',
      step1Desc: '소셜 피드의 불필요한 소음 없이 특정 기술과 전문 분야를 가진 인재를 직접 탐색하세요.',
      step2Title: '2. 이해 (Understand)',
      step2Desc: '연락하기 전에 상대방의 실제 역량, 관심사 및 전문 분야를 명확하게 파악하세요.',
      step3Title: '3. 연결 (Connect)',
      step3Desc: 'LinkedIn, GitHub 또는 포트폴리오로 바로 이동하여 진정한 프로페셔널 네트워킹을 시작하세요.',
      recentlyJoinedTitle: '최근 등록된 인재',
      recentlyJoinedSubtitle: '새롭게 공개되어 탐색 가능한 프로필',
      emptyPlatformTitle: '당신의 글로벌 네트워크가 여기서 시작됩니다.',
      emptyPlatformDesc: '당신의 전문성과 역량을 전 세계에 가장 먼저 공개해보세요.',
      emptyPlatformCta: '프로필 만들기',
    },
    discover: {
      title: '인재 탐색',
      subtitle: '기술, 관심사, 전문 분야 및 위치를 기반으로 사람들을 찾아보세요.',
      searchPlaceholder: '사람, 기술, 산업 또는 관심사 검색...',
      filterButton: '필터',
      clearFilters: '필터 초기화',
      categories: '카테고리',
      skills: '보유 기술',
      interests: '관심 분야',
      country: '국가',
      language: '구사 언어',
      allCategories: '모든 카테고리',
      allCountries: '모든 국가',
      allLanguages: '모든 언어',
      resultsFound: '명의 인재 검색됨',
      noResultsTitle: '일치하는 인재가 없습니다',
      noResultsDesc: '해당 조건과 일치하는 프로필을 찾을 수 없습니다. 검색어를 변경하거나 필터를 초기화해 보세요.',
      emptyNetworkTitle: '네트워크가 이제 막 시작되었습니다.',
      emptyNetworkDesc: '사용자들이 프로필을 생성하고 공개하면 이곳에 표시됩니다. 가장 먼저 프로필을 등록해보세요.',
      createProfileCta: '내 프로필 등록하기',
      viewProfile: '프로필 보기',
    },
    profile: {
      viewLinkedIn: 'LinkedIn 프로필 보기',
      personalWebsite: '개인 웹사이트',
      github: 'GitHub 프로필',
      portfolio: '포트폴리오',
      skillsTitle: '보유 역량 및 기술',
      interestsTitle: '관심 분야',
      categoriesTitle: '산업 카테고리',
      languagesTitle: '구사 언어',
      aboutTitle: '소개 및 프로페셔널 바이오',
      qrTitle: '프로페셔널 아이덴티티 QR',
      qrDesc: '이 코드를 스캔하여 KoicaKonnect 프로필에 바로 접속하세요.',
      downloadQr: 'QR 다운로드',
      copyLink: '프로필 링크 복사',
      copied: '링크가 복사되었습니다!',
      translateTitle: '언어 번역',
      translateTo: '다음 언어로 번역:',
      originalLanguage: '원문',
      translating: '번역 중...',
      translatedBadge: '번역됨',
      resetTranslation: '원문 보기',
      notFoundTitle: '프로필을 찾을 수 없습니다',
      notFoundDesc: '요청하신 프로필이 존재하지 않거나 아직 공개되지 않았습니다.',
      backToDiscover: '탐색 페이지로 돌아가기',
    },
    dashboard: {
      welcome: '환영합니다',
      completenessTitle: '프로필 완성도',
      completenessTip: '더 많은 기술과 외부 링크를 추가하여 탐색 가능성을 높여보세요.',
      statusTitle: '프로필 공개 상태',
      statusPublished: '공개됨 (Public)',
      statusDraft: '임시저장 (비공개)',
      statusPrivate: '비공개',
      publishNow: '프로필 공개하기',
      unpublish: '임시저장으로 전환',
      viewPublicProfile: '공개 프로필 보기',
      editProfile: '프로필 수정',
      qrCodeCard: '나의 KoicaKonnect QR 카드',
      publicUrl: '공개 프로필 URL',
    },
    qrPage: {
      title: '나의 KoicaKonnect QR 코드',
      subtitle: '어디서나 전문 아이덴티티를 공유하세요. 코드를 스캔하면 프로필로 즉시 이동합니다.',
      downloadPng: 'PNG 카드 다운로드',
      downloadSvg: 'SVG 다운로드',
      copyUrl: '프로필 링크 복사',
      shareTitle: '디지털 신원 카드',
      useCasesTitle: '활용 방법',
      useCase1: '컨퍼런스 명찰 및 오프라인 네트워킹',
      useCase2: '명함 및 이력서/CV',
      useCase3: '발표 슬라이드 및 강연 자료',
      useCase4: '이메일 서명 및 개인 포트폴리오 웹사이트',
    },
  },
};
