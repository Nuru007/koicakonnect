export type LanguageCode = 'en' | 'fr' | 'ko';

export interface Translations {
  common: {
    search: string;
    filter: string;
    filters: string;
    clearFilters: string;
    viewAll: string;
    viewProfile: string;
    learnMore: string;
    getStarted: string;
    continue: string;
    save: string;
    saveDraft: string;
    saved: string;
    saving: string;
    savedCheck: string;
    saveFailed: string;
    lastSaved: string;
    publish: string;
    publishing: string;
    published: string;
    publishedLive: string;
    unpublish: string;
    back: string;
    next: string;
    previous: string;
    cancel: string;
    close: string;
    delete: string;
    edit: string;
    share: string;
    copy: string;
    copied: string;
    loading: string;
    error: string;
    tryAgain: string;
    notAvailable: string;
    you: string;
    more: string;
    popularInCohort: string;
    verifiedProfile: string;
    liveDirectory: string;
    notASocialNetwork: string;
    copyright: string;
  };
  nav: {
    brand: string;
    discover: string;
    categories: string;
    countries: string;
    signIn: string;
    signUp: string;
    createProfile: string;
    myProfile: string;
    dashboard: string;
    qrCode: string;
    settings: string;
    signOut: string;
  };
  home: {
    heroBadge: string;
    heroTitleConnect: string;
    heroTitleWith: string;
    heroSubtitle: string;
    discoverBtn: string;
    createProfileBtn: string;
    searchPlaceholder: string;
    searchBtn: string;
    popularInCohort: string;
    realTimeFeed: string;
    recentlyJoinedTitle: string;
    recentlyJoinedSubtitle: string;
    viewAllRegistered: string;
    emptyPlatformTitle: string;
    emptyPlatformDesc: string;
    emptyPlatformCta: string;
    exploreDiscoverPage: string;
    whatWeDoBadge: string;
    whatWeDoTitle: string;
    whatWeDoSubtitle: string;
    viewAllCategories: string;
    theDiscoveryLayer: string;
    koicaProgramBadge: string;
    howItWorksTitle: string;
    howItWorksSubtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    qrPassNotice: string;
    getDigitalIdentityBtn: string;
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
    exploreTalent: string;
    selectedSkills: string;
    addCustomSkill: string;
    selectFilter: string;
  };
  categoriesPage: {
    badge: string;
    title: string;
    subtitle: string;
    talentCount: string;
    exploreTalent: string;
    noCategories: string;
  };
  countriesPage: {
    badge: string;
    title: string;
    subtitle: string;
    registeredLeaders: string;
    activeNations: string;
    primaryCohortTitle: string;
    primaryCohortSubtitle: string;
    otherNationsTitle: string;
    otherNationsSubtitle: string;
    viewCountryTalent: string;
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
    draftOwnerNotice: string;
    draftOwnerDesc: string;
    completeAndPublish: string;
    shareProfile: string;
    verifiedLeader: string;
    contactAndLinks: string;
  };
  profileBuilder: {
    pageTitle: string;
    pageSubtitle: string;
    saveDraftBtn: string;
    savingBtn: string;
    savedBtn: string;
    saveError: string;
    draftPrivateBadge: string;
    publishedLiveBadge: string;
    draftBannerTitle: string;
    draftBannerDesc: string;
    publishedBannerTitle: string;
    publishedBannerDesc: string;
    stepOf: string;
    step1Title: string;
    step1Subtitle: string;
    headshotLabel: string;
    uploadPhotoBtn: string;
    photoTip: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    usernameLabel: string;
    roleLabel: string;
    rolePlaceholder: string;
    orgLabel: string;
    orgPlaceholder: string;
    countryLabel: string;
    selectCountry: string;
    cityLabel: string;
    cityPlaceholder: string;
    step2Title: string;
    step2Subtitle: string;
    bioLabel: string;
    bioPlaceholder: string;
    bioTip: string;
    preferredLangLabel: string;
    step3Title: string;
    step3Subtitle: string;
    selectedSkillsTitle: string;
    noSkillsYet: string;
    addCustomSkillLabel: string;
    addCustomSkillPlaceholder: string;
    addBtn: string;
    suggestedSkills: string;
    step4Title: string;
    step4Subtitle: string;
    selectedInterestsTitle: string;
    noInterestsYet: string;
    addCustomInterestLabel: string;
    addCustomInterestPlaceholder: string;
    suggestedInterests: string;
    step5Title: string;
    step5Subtitle: string;
    step6Title: string;
    step6Subtitle: string;
    step7Title: string;
    step7Subtitle: string;
    linkedinLabel: string;
    websiteLabel: string;
    githubLabel: string;
    portfolioLabel: string;
    step8Title: string;
    step8Subtitle: string;
    discoverCardPreview: string;
    qrCardPreview: string;
    readyToPublishTitle: string;
    readyToPublishDesc: string;
    publishNowBtn: string;
    unpublishBtn: string;
    previousStepBtn: string;
    saveAndContinueBtn: string;
    viewPublicProfileBtn: string;
    signInRequiredTitle: string;
    signInRequiredDesc: string;
    signInToBuilderBtn: string;
  };
  dashboard: {
    welcome: string;
    welcomeSubtitle: string;
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
    shareCard: string;
    quickStats: string;
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
  auth: {
    signInTitle: string;
    signInSubtitle: string;
    signUpTitle: string;
    signUpSubtitle: string;
    forgotPasswordTitle: string;
    forgotPasswordSubtitle: string;
    resetPasswordTitle: string;
    resetPasswordSubtitle: string;
    emailLabel: string;
    passwordLabel: string;
    nameLabel: string;
    roleLabel: string;
    orgLabel: string;
    countryLabel: string;
    cityLabel: string;
    forgotPasswordLink: string;
    signInBtn: string;
    signingInBtn: string;
    signUpBtn: string;
    creatingAccountBtn: string;
    noAccountPrompt: string;
    createAccountLink: string;
    haveAccountPrompt: string;
    signInLink: string;
    passwordRequirements: string;
    accountDeactivatedTitle: string;
    accountDeactivatedDesc: string;
    loginSuccess: string;
    registerSuccess: string;
    resetLinkSent: string;
    passwordResetSuccess: string;
    invalidCredentials: string;
    emailAlreadyExists: string;
    userNotFound: string;
  };
  settings: {
    title: string;
    subtitle: string;
    accountInfoTitle: string;
    dangerZoneTitle: string;
    dangerZoneDesc: string;
    deactivateBtn: string;
    deactivateConfirm: string;
    deleteBtn: string;
    deleteConfirm: string;
  };
  footer: {
    manifesto: string;
    youthLeadersProgram: string;
    liveDirectory: string;
    discoverSection: string;
    searchDirectory: string;
    focusDisciplines: string;
    partnerNations: string;
    platformSection: string;
    createProfile: string;
    signIn: string;
    digitalPass: string;
    languageSection: string;
    copyright: string;
    notASocialNetwork: string;
  };
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    common: {
      search: 'Search',
      filter: 'Filter',
      filters: 'Filters',
      clearFilters: 'Clear Filters',
      viewAll: 'View All',
      viewProfile: 'View Profile',
      learnMore: 'Learn More',
      getStarted: 'Get Started',
      continue: 'Continue',
      save: 'Save',
      saveDraft: 'Save Draft',
      saved: 'Saved!',
      saving: 'Saving...',
      savedCheck: 'Draft saved ✓',
      saveFailed: "Couldn't save. Try again.",
      lastSaved: 'Saved',
      publish: 'Publish',
      publishing: 'Publishing...',
      published: 'Published',
      publishedLive: 'Published & Live',
      unpublish: 'Unpublish to Draft',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      cancel: 'Cancel',
      close: 'Close',
      delete: 'Delete',
      edit: 'Edit',
      share: 'Share',
      copy: 'Copy Link',
      copied: 'Copied!',
      loading: 'Loading...',
      error: 'Error',
      tryAgain: 'Try Again',
      notAvailable: 'Not Available',
      you: 'You',
      more: 'more',
      popularInCohort: 'Popular in Cohort:',
      verifiedProfile: 'Verified Profile',
      liveDirectory: 'Live Directory',
      notASocialNetwork: 'Not a social network. No feeds or algorithms.',
      copyright: '© 2026 KOICA CONNECT. All rights reserved.',
    },
    nav: {
      brand: 'KOICA CONNECT',
      discover: 'Discover',
      categories: 'Categories',
      countries: 'Countries',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      createProfile: 'Create Profile',
      myProfile: 'My Profile',
      dashboard: 'Dashboard',
      qrCode: 'QR Pass',
      settings: 'Settings',
      signOut: 'Sign Out',
    },
    home: {
      heroBadge: 'KOICA Youth Leaders Program • 2026–2027',
      heroTitleConnect: 'Connect & Discover',
      heroTitleWith: 'with your fellow leaders across Africa',
      heroSubtitle: 'Discover researchers, technical specialists, entrepreneurs, and leaders across Africa and global partner hubs.',
      discoverBtn: 'Discover People',
      createProfileBtn: 'Create Your Profile',
      searchPlaceholder: 'Search people, skills, industries or interests...',
      searchBtn: 'Search',
      popularInCohort: 'Popular in Cohort:',
      realTimeFeed: 'Real-Time Discovery Feed',
      recentlyJoinedTitle: 'Discover Experts & Leaders',
      recentlyJoinedSubtitle: 'Profiles are indexed directly from our live database with zero simulated data.',
      viewAllRegistered: 'View All Registered People',
      emptyPlatformTitle: 'Your network begins here.',
      emptyPlatformDesc: 'Be one of the first people to make your expertise and capabilities discoverable worldwide.',
      emptyPlatformCta: 'Create Your Profile',
      exploreDiscoverPage: 'Explore Discover Page',
      whatWeDoBadge: 'Focus Disciplines',
      whatWeDoTitle: 'We Connect Leaders Across High-Impact Fields',
      whatWeDoSubtitle: 'Connecting researchers, founders, and technical leaders across global innovation ecosystems.',
      viewAllCategories: 'View All Categories',
      theDiscoveryLayer: 'The Discovery Layer',
      koicaProgramBadge: 'KOICA Youth Leaders Program',
      howItWorksTitle: 'How KoicaKonnect Works',
      howItWorksSubtitle: 'KOICA CONNECT is intentionally not a social network. No endless feeds, no follower counts, no algorithm traps. Simply find authentic talent and connect where it matters.',
      step1Title: '1. Discover',
      step1Desc: 'Find professionals by precise skills without the noise of traditional social networks.',
      step2Title: '2. Understand',
      step2Desc: 'Explore their real skills, areas of interest and verified industry categories.',
      step3Title: '3. Connect',
      step3Desc: 'Access their LinkedIn, GitHub or portfolio directly to initiate a relevant professional connection.',
      qrPassNotice: 'Every published profile receives a unique, scannable QR Identity Pass.',
      getDigitalIdentityBtn: 'Get Your Digital Identity',
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
      exploreTalent: 'Explore talent',
      selectedSkills: 'Selected Skills',
      addCustomSkill: 'Add Custom Skill',
      selectFilter: 'Select filter...',
    },
    categoriesPage: {
      badge: 'Focus Disciplines',
      title: 'Browse by Industry & Field',
      subtitle: 'Discover professionals, domain researchers, and technical leaders organized across database-backed industry tracks.',
      talentCount: 'leaders',
      exploreTalent: 'Explore talent',
      noCategories: 'No categories available at this moment.',
    },
    countriesPage: {
      badge: 'Global Directory & Cohort Hubs',
      title: 'Discover by Country & Region',
      subtitle: 'Connect with leaders, researchers, and specialists across the 5 KOICA African partner countries and international hubs.',
      registeredLeaders: 'Published Leaders',
      activeNations: 'Active Partner Nations',
      primaryCohortTitle: 'Primary African Partner Countries',
      primaryCohortSubtitle: 'Core partner countries participating in the KOICA Youth Leaders fellowship program.',
      otherNationsTitle: 'Other Participating Nations & Hubs',
      otherNationsSubtitle: 'Active members registered from international innovation hubs and diaspora networks.',
      viewCountryTalent: 'View country talent',
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
      draftOwnerNotice: 'Draft Mode — Only you can see this',
      draftOwnerDesc: 'Your profile is currently saved as a draft. Complete your steps and hit publish to become discoverable.',
      completeAndPublish: 'Complete & Publish Profile',
      shareProfile: 'Share Profile',
      verifiedLeader: 'Verified Leader',
      contactAndLinks: 'Contact & Professional Links',
    },
    profileBuilder: {
      pageTitle: 'Profile Builder',
      pageSubtitle: 'Build your digital identity and make yourself discoverable globally',
      saveDraftBtn: 'Save Draft',
      savingBtn: 'Saving...',
      savedBtn: 'Saved!',
      saveError: "Couldn't save. Try again.",
      draftPrivateBadge: 'Draft (Private)',
      publishedLiveBadge: 'Published & Live',
      draftBannerTitle: 'Your profile is private (Draft Mode)',
      draftBannerDesc: 'Your progress is automatically saved to your private account. Complete your profile and hit Publish in Step 8 to appear on Discover.',
      publishedBannerTitle: 'Your profile is live',
      publishedBannerDesc: 'People can discover your profile on Koica Connect search and category filters.',
      stepOf: 'Step {step} of 8',
      step1Title: 'Step 1 — Basic Information',
      step1Subtitle: 'Your core identity details on Koica Connect',
      headshotLabel: 'Headshot Photo',
      uploadPhotoBtn: 'Upload Profile Photo',
      photoTip: 'Recommended: High quality square PNG or JPG, max 10MB.',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'e.g. Dr. Ngozi Okonjo',
      usernameLabel: 'Username / Handle',
      roleLabel: 'Current Role / Profession',
      rolePlaceholder: 'e.g. Director General, Economist',
      orgLabel: 'Organisation / Institution',
      orgPlaceholder: 'e.g. World Trade Organization',
      countryLabel: 'Country',
      selectCountry: 'Select country...',
      cityLabel: 'City',
      cityPlaceholder: 'e.g. Abuja, Geneva',
      step2Title: 'Step 2 — About & Bio',
      step2Subtitle: 'Provide a professional summary of your background, experience, and vision',
      bioLabel: 'Professional Bio',
      bioPlaceholder: 'Share your career journey, key accomplishments, KOICA fellowship experience, and areas you are passionate about collaborating in...',
      bioTip: 'Tip: A compelling bio helps international partners and alumni connect with you for opportunities.',
      preferredLangLabel: 'Preferred Language of Communication',
      step3Title: 'Step 3 — Skills & Areas of Expertise',
      step3Subtitle: 'Highlight your core capabilities and technical skills',
      selectedSkillsTitle: 'Your Selected Skills',
      noSkillsYet: 'No skills added yet. Select from below or type a custom skill.',
      addCustomSkillLabel: 'Add Custom Skill',
      addCustomSkillPlaceholder: 'e.g. Sustainable Agriculture, Public Policy, Cloud Architecture',
      addBtn: 'Add',
      suggestedSkills: 'Suggested Skills',
      step4Title: 'Step 4 — Areas of Interest',
      step4Subtitle: 'Select topics and fields you are interested in collaborating on',
      selectedInterestsTitle: 'Your Selected Interests',
      noInterestsYet: 'No interests added yet. Pick from below or type a custom interest.',
      addCustomInterestLabel: 'Add Custom Interest',
      addCustomInterestPlaceholder: 'e.g. AI for Healthcare, Renewable Microgrids, Climate Finance',
      suggestedInterests: 'Suggested Interests',
      step5Title: 'Step 5 — Focus Disciplines',
      step5Subtitle: 'Choose the KOICA focus disciplines and industry categories that represent your work',
      step6Title: 'Step 6 — Spoken Languages',
      step6Subtitle: 'Indicate the languages you speak to connect across international chapters',
      step7Title: 'Step 7 — Professional Links',
      step7Subtitle: 'Connect your professional social profiles, website, or portfolio',
      linkedinLabel: 'LinkedIn Profile URL',
      websiteLabel: 'Personal / Organisation Website',
      githubLabel: 'GitHub Profile URL (Optional)',
      portfolioLabel: 'Portfolio / Publications URL (Optional)',
      step8Title: 'Step 8 — Live Profile Preview & Publish',
      step8Subtitle: 'Review how your profile and digital pass will appear to the world',
      discoverCardPreview: 'Discover Card Preview',
      qrCardPreview: 'Digital QR Identity Card Preview',
      readyToPublishTitle: 'Ready to make your profile live?',
      readyToPublishDesc: 'Publishing immediately makes you discoverable across skills, categories, and keywords.',
      publishNowBtn: 'Publish Profile Now',
      unpublishBtn: 'Unpublish to Draft',
      previousStepBtn: 'Previous Step',
      saveAndContinueBtn: 'Save & Continue',
      viewPublicProfileBtn: 'View Public Profile',
      signInRequiredTitle: 'Sign In Required',
      signInRequiredDesc: 'Please sign in to your KOICA CONNECT account to build and edit your profile.',
      signInToBuilderBtn: 'Sign In to Profile Builder',
    },
    dashboard: {
      welcome: 'Welcome back',
      welcomeSubtitle: 'Manage your professional identity, track discoverability, and update your profile.',
      completenessTitle: 'Profile Completeness',
      completenessTip: 'Add more skills and external links to improve your discoverability.',
      statusTitle: 'Profile Visibility',
      statusPublished: 'Published & Public',
      statusDraft: 'Draft (Private)',
      statusPrivate: 'Private',
      publishNow: 'Publish Profile',
      unpublish: 'Unpublish to Draft',
      viewPublicProfile: 'View Public Profile',
      editProfile: 'Edit Profile',
      qrCodeCard: 'Your KOICA CONNECT QR Pass',
      publicUrl: 'Your Public Profile URL',
      shareCard: 'Share Your Digital Pass',
      quickStats: 'Overview',
    },
    qrPage: {
      title: 'Your KOICA CONNECT QR Code',
      subtitle: 'Share your professional identity anywhere. Anyone can scan this code to view your KOICA CONNECT profile.',
      downloadPng: 'Download PNG Pass',
      downloadSvg: 'Download SVG',
      copyUrl: 'Copy Profile Link',
      shareTitle: 'Digital Identity Card',
      useCasesTitle: 'Real-World Use Cases',
      useCase1: 'Conference badges & networking meetups',
      useCase2: 'Business cards & CV / Resumes',
      useCase3: 'Presentation slides & speaking decks',
      useCase4: 'Email signatures & personal portfolio websites',
    },
    auth: {
      signInTitle: 'Sign In to KOICA CONNECT',
      signInSubtitle: 'Welcome back! Enter your credentials to access your profile.',
      signUpTitle: 'Create Your KOICA CONNECT Account',
      signUpSubtitle: 'Join fellow leaders, alumni, and specialists across Africa and partner hubs.',
      forgotPasswordTitle: 'Reset Your Password',
      forgotPasswordSubtitle: 'Enter your account email to receive password recovery instructions.',
      resetPasswordTitle: 'Set New Password',
      resetPasswordSubtitle: 'Choose a strong, secure password for your account.',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      nameLabel: 'Full Name',
      roleLabel: 'Current Role / Profession',
      orgLabel: 'Organisation / Institution',
      countryLabel: 'Country',
      cityLabel: 'City',
      forgotPasswordLink: 'Forgot password?',
      signInBtn: 'Sign In',
      signingInBtn: 'Signing in...',
      signUpBtn: 'Create Account',
      creatingAccountBtn: 'Creating account...',
      noAccountPrompt: "Don't have an account?",
      createAccountLink: 'Create one now',
      haveAccountPrompt: 'Already have an account?',
      signInLink: 'Sign in here',
      passwordRequirements: 'Password must be at least 8 characters long.',
      accountDeactivatedTitle: 'This account is currently unavailable.',
      accountDeactivatedDesc: 'Please contact KOICA CONNECT support if you believe this is a mistake.',
      loginSuccess: 'Signing you in... Directing to your dashboard.',
      registerSuccess: 'Your account has been created. Directing you to the Profile Builder...',
      resetLinkSent: 'Password reset link has been sent to your email.',
      passwordResetSuccess: 'Your password has been successfully reset. Please sign in.',
      invalidCredentials: 'Invalid email address or password. Please try again.',
      emailAlreadyExists: 'An account already exists with this email.',
      userNotFound: 'No account found with this email address.',
    },
    settings: {
      title: 'Account Settings',
      subtitle: 'Manage your security credentials and account status',
      accountInfoTitle: 'Account Details',
      dangerZoneTitle: 'Danger Zone',
      dangerZoneDesc: 'Deactivating your account will immediately hide your profile and digital pass from the public directory.',
      deactivateBtn: 'Deactivate Account',
      deactivateConfirm: 'Are you sure you want to deactivate your account?',
      deleteBtn: 'Delete Account Permanently',
      deleteConfirm: 'Are you sure you want to permanently delete your account and all associated data?',
    },
    footer: {
      manifesto: 'Discover people before you network with them. The dedicated discovery and professional identity layer connecting leaders across Africa and global partner hubs.',
      youthLeadersProgram: 'Youth Leaders Program',
      liveDirectory: 'Live Directory',
      discoverSection: 'Discover',
      searchDirectory: 'Search Directory',
      focusDisciplines: 'Focus Disciplines',
      partnerNations: 'Partner Nations',
      platformSection: 'Platform',
      createProfile: 'Create Profile',
      signIn: 'Sign In',
      digitalPass: 'Digital Pass & QR',
      languageSection: 'Language',
      copyright: '© 2026 KOICA CONNECT. All rights reserved.',
      notASocialNetwork: 'Not a social network. No feeds or algorithms.',
    },
  },

  fr: {
    common: {
      search: 'Rechercher',
      filter: 'Filtrer',
      filters: 'Filtres',
      clearFilters: 'Effacer les filtres',
      viewAll: 'Voir tout',
      viewProfile: 'Voir le profil',
      learnMore: 'En savoir plus',
      getStarted: 'Commencer',
      continue: 'Continuer',
      save: 'Enregistrer',
      saveDraft: 'Enregistrer le brouillon',
      saved: 'Enregistré !',
      saving: 'Enregistrement...',
      savedCheck: 'Brouillon enregistré ✓',
      saveFailed: "Impossible d'enregistrer. Réessayez.",
      lastSaved: 'Enregistré',
      publish: 'Publier',
      publishing: 'Publication...',
      published: 'Publié',
      publishedLive: 'Publié & En ligne',
      unpublish: 'Rétablir en brouillon',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      cancel: 'Annuler',
      close: 'Fermer',
      delete: 'Supprimer',
      edit: 'Modifier',
      share: 'Partager',
      copy: 'Copier le lien',
      copied: 'Copié !',
      loading: 'Chargement...',
      error: 'Erreur',
      tryAgain: 'Réessayer',
      notAvailable: 'Non disponible',
      you: 'Vous',
      more: 'de plus',
      popularInCohort: 'Populaire dans la cohorte :',
      verifiedProfile: 'Profil vérifié',
      liveDirectory: 'Répertoire en direct',
      notASocialNetwork: 'Pas un réseau social. Sans flux ni algorithmes.',
      copyright: '© 2026 KOICA CONNECT. Tous droits réservés.',
    },
    nav: {
      brand: 'KOICA CONNECT',
      discover: 'Découvrir',
      categories: 'Catégories',
      countries: 'Pays',
      signIn: 'Connexion',
      signUp: 'Inscription',
      createProfile: 'Créer un profil',
      myProfile: 'Mon Profil',
      dashboard: 'Tableau de bord',
      qrCode: 'Passe QR',
      settings: 'Paramètres',
      signOut: 'Déconnexion',
    },
    home: {
      heroBadge: 'Programme des Jeunes Leaders KOICA • 2026–2027',
      heroTitleConnect: 'Connecter & Découvrir',
      heroTitleWith: 'avec vos pairs et leaders à travers l’Afrique',
      heroSubtitle: 'Découvrez des chercheurs, spécialistes techniques, entrepreneurs et leaders à travers l’Afrique et les pôles partenaires mondiaux.',
      discoverBtn: 'Découvrir des personnes',
      createProfileBtn: 'Créer votre profil',
      searchPlaceholder: 'Rechercher des personnes, compétences, secteurs ou intérêts...',
      searchBtn: 'Rechercher',
      popularInCohort: 'Populaire dans la cohorte :',
      realTimeFeed: 'Flux de découverte en direct',
      recentlyJoinedTitle: 'Découvrir des Experts & Leaders',
      recentlyJoinedSubtitle: 'Les profils sont indexés directement depuis notre base de données sans aucune donnée simulée.',
      viewAllRegistered: 'Voir toutes les personnes inscrites',
      emptyPlatformTitle: 'Votre réseau commence ici.',
      emptyPlatformDesc: 'Soyez parmi les premiers à rendre votre expertise visible à l’échelle mondiale.',
      emptyPlatformCta: 'Créer votre profil',
      exploreDiscoverPage: 'Explorer la page Découvrir',
      whatWeDoBadge: 'Disciplines Clés',
      whatWeDoTitle: 'Nous Connectons les Leaders dans des Domaines à Fort Impact',
      whatWeDoSubtitle: 'Connecter chercheurs, fondateurs et leaders techniques à travers les écosystèmes d’innovation mondiaux.',
      viewAllCategories: 'Voir toutes les catégories',
      theDiscoveryLayer: 'La Couche de Découverte',
      koicaProgramBadge: 'Programme des Jeunes Leaders KOICA',
      howItWorksTitle: 'Comment fonctionne KoicaKonnect',
      howItWorksSubtitle: 'KOICA CONNECT n’est volontairement pas un réseau social. Pas de flux infinis, pas de compteurs d’abonnés, pas de pièges algorithmiques. Trouvez simplement des talents authentiques et connectez-vous là où cela compte.',
      step1Title: '1. Découvrir',
      step1Desc: 'Trouvez des professionnels par compétences précises sans le bruit des réseaux sociaux traditionnels.',
      step2Title: '2. Comprendre',
      step2Desc: 'Explorez leurs véritables compétences, centres d’intérêt et catégories industrielles vérifiées.',
      step3Title: '3. Connecter',
      step3Desc: 'Accédez directement à leur LinkedIn, GitHub ou portfolio pour initier un contact professionnel pertinent.',
      qrPassNotice: 'Chaque profil publié reçoit un Passe d’Identité QR unique et scannable.',
      getDigitalIdentityBtn: 'Obtenir Votre Identité Numérique',
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
      noResultsDesc: "Nous n'avons trouvé personne correspondant à ces critères. Essayez d'ajuster votre recherche ou d'effacer certains filtres.",
      emptyNetworkTitle: 'Le réseau vient tout juste de démarrer.',
      emptyNetworkDesc: 'Les profils apparaîtront ici au fur et à mesure de leur création et publication.',
      createProfileCta: 'Créer votre profil',
      viewProfile: 'Voir le profil',
      exploreTalent: 'Explorer les talents',
      selectedSkills: 'Compétences sélectionnées',
      addCustomSkill: 'Ajouter une compétence personnalisée',
      selectFilter: 'Sélectionner un filtre...',
    },
    categoriesPage: {
      badge: 'Disciplines Clés',
      title: 'Parcourir par Secteur & Domaine',
      subtitle: 'Découvrez des professionnels, chercheurs et leaders techniques organisés par filières sectorielles vérifiées.',
      talentCount: 'leaders',
      exploreTalent: 'Explorer les talents',
      noCategories: 'Aucune catégorie disponible pour le moment.',
    },
    countriesPage: {
      badge: 'Répertoire Mondial & Hubs de Cohortes',
      title: 'Découvrir par Pays & Région',
      subtitle: 'Connectez-vous avec des leaders, chercheurs et spécialistes à travers les 5 pays partenaires africains de la KOICA et les pôles mondiaux.',
      registeredLeaders: 'Leaders Publiés',
      activeNations: 'Nations Partenaires Actives',
      primaryCohortTitle: 'Principaux Pays Partenaires Africains',
      primaryCohortSubtitle: 'Pays partenaires participant au programme de bourses des Jeunes Leaders KOICA.',
      otherNationsTitle: 'Autres Nations & Pôles Participants',
      otherNationsSubtitle: 'Membres actifs inscrits depuis des pôles d’innovation internationaux et réseaux de la diaspora.',
      viewCountryTalent: 'Voir les talents du pays',
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
      copied: 'Copié dans le presse-papiers !',
      translateTitle: 'Traduction linguistique',
      translateTo: 'Traduire en',
      originalLanguage: 'Original',
      translating: 'Traduction...',
      translatedBadge: 'Traduit',
      resetTranslation: 'Afficher l’original',
      notFoundTitle: 'Profil Introuvable',
      notFoundDesc: 'Le profil utilisateur que vous recherchez n’existe pas ou n’a pas encore été publié.',
      backToDiscover: 'Retour à Découvrir',
      draftOwnerNotice: 'Mode Brouillon — Visible uniquement par vous',
      draftOwnerDesc: 'Votre profil est actuellement enregistré en brouillon. Complétez vos étapes et publiez pour être visible.',
      completeAndPublish: 'Compléter & Publier le Profil',
      shareProfile: 'Partager le profil',
      verifiedLeader: 'Leader Vérifié',
      contactAndLinks: 'Contact & Liens Professionnels',
    },
    profileBuilder: {
      pageTitle: 'Générateur de Profil',
      pageSubtitle: 'Créez votre identité numérique et devenez visible à l’international',
      saveDraftBtn: 'Enregistrer le brouillon',
      savingBtn: 'Enregistrement...',
      savedBtn: 'Enregistré !',
      saveError: "Impossible d'enregistrer. Réessayez.",
      draftPrivateBadge: 'Brouillon (Privé)',
      publishedLiveBadge: 'Publié & En ligne',
      draftBannerTitle: 'Votre profil est privé (Mode Brouillon)',
      draftBannerDesc: 'Vos progrès sont automatiquement enregistrés. Complétez votre profil et cliquez sur Publier à l’étape 8 pour apparaître sur Découvrir.',
      publishedBannerTitle: 'Votre profil est en ligne',
      publishedBannerDesc: 'Votre profil est désormais accessible via la recherche et les catégories de Koica Connect.',
      stepOf: 'Étape {step} sur 8',
      step1Title: 'Étape 1 — Informations de Base',
      step1Subtitle: 'Vos informations d’identité essentielles sur Koica Connect',
      headshotLabel: 'Photo de Profil',
      uploadPhotoBtn: 'Téléverser une Photo',
      photoTip: 'Recommandé : image carrée de haute qualité en PNG ou JPG, max 10 Mo.',
      fullNameLabel: 'Nom Complet',
      fullNamePlaceholder: 'ex. Dr. Ngozi Okonjo',
      usernameLabel: 'Identifiant / Nom d’utilisateur',
      roleLabel: 'Poste Actuel / Profession',
      rolePlaceholder: 'ex. Directrice Générale, Économiste',
      orgLabel: 'Organisation / Institution',
      orgPlaceholder: 'ex. Organisation Mondiale du Commerce',
      countryLabel: 'Pays',
      selectCountry: 'Sélectionner un pays...',
      cityLabel: 'Ville',
      cityPlaceholder: 'ex. Abidjan, Dakar, Paris',
      step2Title: 'Étape 2 — À Propos & Bio',
      step2Subtitle: 'Présentez un résumé professionnel de votre parcours, expérience et vision',
      bioLabel: 'Bio Professionnelle',
      bioPlaceholder: 'Partagez votre parcours, réalisations clés, expérience KOICA et opportunités de collaboration recherchées...',
      bioTip: 'Conseil : Une bio soignée aide les partenaires internationaux à vous contacter pour des opportunités.',
      preferredLangLabel: 'Langue de Communication Préférée',
      step3Title: 'Étape 3 — Compétences & Domaines d’Expertise',
      step3Subtitle: 'Mettez en avant vos compétences clés et techniques',
      selectedSkillsTitle: 'Vos Compétences Sélectionnées',
      noSkillsYet: 'Aucune compétence ajoutée. Choisissez ci-dessous ou saisissez-en une.',
      addCustomSkillLabel: 'Ajouter une Compétence Personnalisée',
      addCustomSkillPlaceholder: 'ex. Agriculture Durable, Politiques Publiques, Cloud',
      addBtn: 'Ajouter',
      suggestedSkills: 'Compétences Suggérées',
      step4Title: 'Étape 4 — Centres d’Intérêt',
      step4Subtitle: 'Sélectionnez les sujets et thématiques qui vous passionnent',
      selectedInterestsTitle: 'Vos Centres d’Intérêt Sélectionnés',
      noInterestsYet: 'Aucun centre d’intérêt ajouté. Choisissez ci-dessous ou saisissez-en un.',
      addCustomInterestLabel: 'Ajouter un Centre d’Intérêt Personnalisé',
      addCustomInterestPlaceholder: 'ex. IA en Santé, Micro-réseaux Solaires, Climat',
      suggestedInterests: 'Centres d’Intérêt Suggérés',
      step5Title: 'Étape 5 — Disciplines Clés',
      step5Subtitle: 'Choisissez les disciplines KOICA et secteurs d’activité qui décrivent votre travail',
      step6Title: 'Étape 6 — Langues Parlées',
      step6Subtitle: 'Indiquez les langues que vous maîtrisez pour échanger à l’international',
      step7Title: 'Étape 7 — Liens Professionnels',
      step7Subtitle: 'Connectez vos profils sociaux professionnels, site web ou portfolio',
      linkedinLabel: 'URL du Profil LinkedIn',
      websiteLabel: 'Site Web Personnel ou Professionnel',
      githubLabel: 'URL du Profil GitHub (Optionnel)',
      portfolioLabel: 'URL du Portfolio / Publications (Optionnel)',
      step8Title: 'Étape 8 — Aperçu en Direct & Publication',
      step8Subtitle: 'Vérifiez la présentation de votre profil et de votre passe numérique',
      discoverCardPreview: 'Aperçu de la Carte Découvrir',
      qrCardPreview: 'Aperçu du Passe d’Identité QR Numérique',
      readyToPublishTitle: 'Prêt à rendre votre profil public ?',
      readyToPublishDesc: 'La publication vous rend immédiatement visible par compétences, secteurs et mots-clés.',
      publishNowBtn: 'Publier le Profil Maintenant',
      unpublishBtn: 'Rétablir en Brouillon',
      previousStepBtn: 'Étape Précédente',
      saveAndContinueBtn: 'Enregistrer & Continuer',
      viewPublicProfileBtn: 'Voir le Profil Public',
      signInRequiredTitle: 'Connexion Requise',
      signInRequiredDesc: 'Veuillez vous connecter à votre compte KOICA CONNECT pour créer et modifier votre profil.',
      signInToBuilderBtn: 'Se connecter au Générateur de Profil',
    },
    dashboard: {
      welcome: 'Bienvenue',
      welcomeSubtitle: 'Gérez votre identité professionnelle, suivez votre visibilité et mettez à jour votre profil.',
      completenessTitle: 'Complétude du Profil',
      completenessTip: 'Ajoutez plus de compétences et liens pour améliorer votre visibilité.',
      statusTitle: 'Visibilité du Profil',
      statusPublished: 'Publié & Public',
      statusDraft: 'Brouillon (Privé)',
      statusPrivate: 'Privé',
      publishNow: 'Publier le Profil',
      unpublish: 'Rétablir en Brouillon',
      viewPublicProfile: 'Voir le Profil Public',
      editProfile: 'Modifier le Profil',
      qrCodeCard: 'Votre Passe QR KOICA CONNECT',
      publicUrl: 'URL de votre profil public',
      shareCard: 'Partager Votre Passe Numérique',
      quickStats: 'Aperçu',
    },
    qrPage: {
      title: 'Votre QR Code KOICA CONNECT',
      subtitle: 'Partagez votre identité professionnelle n’importe où. Tout le monde peut scanner ce code pour consulter votre profil.',
      downloadPng: 'Télécharger le Passe PNG',
      downloadSvg: 'Télécharger en SVG',
      copyUrl: 'Copier le lien du profil',
      shareTitle: 'Carte d’Identité Numérique',
      useCasesTitle: 'Cas d’Usage Pratiques',
      useCase1: 'Badges de conférence et rencontres réseau',
      useCase2: 'Cartes de visite & CV',
      useCase3: 'Diaporamas de présentation & conférences',
      useCase4: 'Signatures d’e-mails & sites portfolios personnels',
    },
    auth: {
      signInTitle: 'Connexion à KOICA CONNECT',
      signInSubtitle: 'Bon retour ! Saisissez vos identifiants pour accéder à votre profil.',
      signUpTitle: 'Créer votre compte KOICA CONNECT',
      signUpSubtitle: 'Rejoignez les leaders, boursiers et experts à travers l’Afrique et les pôles partenaires.',
      forgotPasswordTitle: 'Réinitialiser votre mot de passe',
      forgotPasswordSubtitle: 'Saisissez votre e-mail pour recevoir les instructions de récupération.',
      resetPasswordTitle: 'Définir un nouveau mot de passe',
      resetPasswordSubtitle: 'Choisissez un mot de passe sécurisé pour votre compte.',
      emailLabel: 'Adresse E-mail',
      passwordLabel: 'Mot de passe',
      nameLabel: 'Nom Complet',
      roleLabel: 'Poste Actuel / Profession',
      orgLabel: 'Organisation / Institution',
      countryLabel: 'Pays',
      cityLabel: 'Ville',
      forgotPasswordLink: 'Mot de passe oublié ?',
      signInBtn: 'Se connecter',
      signingInBtn: 'Connexion en cours...',
      signUpBtn: 'Créer un compte',
      creatingAccountBtn: 'Création du compte...',
      noAccountPrompt: 'Vous n’avez pas de compte ?',
      createAccountLink: 'Inscrivez-vous maintenant',
      haveAccountPrompt: 'Vous avez déjà un compte ?',
      signInLink: 'Connectez-vous ici',
      passwordRequirements: 'Le mot de passe doit comporter au moins 8 caractères.',
      accountDeactivatedTitle: 'Ce compte est actuellement indisponible.',
      accountDeactivatedDesc: 'Veuillez contacter le support KOICA CONNECT si vous pensez qu’il s’agit d’une erreur.',
      loginSuccess: 'Connexion réussie... Redirection vers votre tableau de bord.',
      registerSuccess: 'Compte créé avec succès. Redirection vers le Générateur de Profil...',
      resetLinkSent: 'Un lien de réinitialisation a été envoyé à votre adresse e-mail.',
      passwordResetSuccess: 'Votre mot de passe a été réinitialisé avec succès. Veuillez vous connecter.',
      invalidCredentials: 'E-mail ou mot de passe incorrect. Veuillez réessayer.',
      emailAlreadyExists: 'Un compte existe déjà avec cette adresse e-mail.',
      userNotFound: 'Aucun compte trouvé avec cette adresse e-mail.',
    },
    settings: {
      title: 'Paramètres du Compte',
      subtitle: 'Gérez vos identifiants de sécurité et le statut de votre compte',
      accountInfoTitle: 'Détails du Compte',
      dangerZoneTitle: 'Zone de Danger',
      dangerZoneDesc: 'Désactiver votre compte masquera immédiatement votre profil et votre passe QR du répertoire public.',
      deactivateBtn: 'Désactiver le Compte',
      deactivateConfirm: 'Êtes-vous sûr de vouloir désactiver votre compte ?',
      deleteBtn: 'Supprimer Définitivement le Compte',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer définitivement votre compte et toutes vos données associées ?',
    },
    footer: {
      manifesto: 'Découvrez des personnes avant d’échanger avec elles. La couche dédiée de découverte et d’identité professionnelle connectant les leaders à travers l’Afrique et les pôles partenaires mondiaux.',
      youthLeadersProgram: 'Programme des Jeunes Leaders',
      liveDirectory: 'Répertoire en Direct',
      discoverSection: 'Découvrir',
      searchDirectory: 'Rechercher dans le Répertoire',
      focusDisciplines: 'Disciplines Clés',
      partnerNations: 'Nations Partenaires',
      platformSection: 'Plateforme',
      createProfile: 'Créer un Profil',
      signIn: 'Connexion',
      digitalPass: 'Passe Numérique & QR',
      languageSection: 'Langue',
      copyright: '© 2026 KOICA CONNECT. Tous droits réservés.',
      notASocialNetwork: 'Pas un réseau social. Sans flux ni algorithmes.',
    },
  },

  ko: {
    common: {
      search: '검색',
      filter: '필터',
      filters: '필터 목록',
      clearFilters: '필터 초기화',
      viewAll: '전체 보기',
      viewProfile: '프로필 보기',
      learnMore: '자세히 보기',
      getStarted: '시작하기',
      continue: '계속하기',
      save: '저장',
      saveDraft: '임시 저장',
      saved: '저장됨!',
      saving: '저장 중...',
      savedCheck: '임시 저장 완료 ✓',
      saveFailed: '저장에 실패했습니다. 다시 시도해 주세요.',
      lastSaved: '저장됨',
      publish: '게시하기',
      publishing: '게시 중...',
      published: '게시됨',
      publishedLive: '게시 완료 및 공개 중',
      unpublish: '비공개(임시 저장)로 전환',
      back: '뒤로',
      next: '다음',
      previous: '이전',
      cancel: '취소',
      close: '닫기',
      delete: '삭제',
      edit: '수정',
      share: '공유',
      copy: '링크 복사',
      copied: '복사되었습니다!',
      loading: '로딩 중...',
      error: '오류',
      tryAgain: '다시 시도',
      notAvailable: '사용할 수 없음',
      you: '본인',
      more: '개 더보기',
      popularInCohort: '코호트 인기 키워드:',
      verifiedProfile: '인증된 프로필',
      liveDirectory: '실시간 디렉터리',
      notASocialNetwork: '소셜 네트워크가 아닙니다. 피드나 알고리즘 없이 인재를 발견하세요.',
      copyright: '© 2026 KOICA CONNECT. All rights reserved.',
    },
    nav: {
      brand: 'KOICA CONNECT',
      discover: '탐색하기',
      categories: '분야별 탐색',
      countries: '국가별 탐색',
      signIn: '로그인',
      signUp: '회원가입',
      createProfile: '프로필 생성',
      myProfile: '내 프로필',
      dashboard: '대시보드',
      qrCode: 'QR 디지털 패스',
      settings: '설정',
      signOut: '로그아웃',
    },
    home: {
      heroBadge: 'KOICA 청년 리더 프로그램 • 2026–2027',
      heroTitleConnect: '연결하고 발견하세요',
      heroTitleWith: '아프리카 전역의 동료 리더들과 함께',
      heroSubtitle: '아프리카 전역과 글로벌 협력 거점의 연구원, 기술 전문가, 창업가 및 리더들을 전문 분야별로 발견하세요.',
      discoverBtn: '인재 탐색하기',
      createProfileBtn: '내 프로필 만들기',
      searchPlaceholder: '이름, 전문 기술, 산업 분야 또는 관심사 검색...',
      searchBtn: '검색',
      popularInCohort: '코호트 인기 키워드:',
      realTimeFeed: '실시간 인재 피드',
      recentlyJoinedTitle: '전문가 및 리더 발견',
      recentlyJoinedSubtitle: '가상의 데이터 없이 실시간 데이터베이스에서 검증된 프로필이 직접 인덱싱됩니다.',
      viewAllRegistered: '등록된 회원 전체 보기',
      emptyPlatformTitle: '네트워크가 여기서 시작됩니다.',
      emptyPlatformDesc: '전 세계에 본인의 전문성과 역량을 가장 먼저 알리는 리더가 되어보세요.',
      emptyPlatformCta: '프로필 만들기',
      exploreDiscoverPage: '탐색 페이지 둘러보기',
      whatWeDoBadge: '핵심 집중 분야',
      whatWeDoTitle: '영향력 높은 산업 분야의 리더들을 연결합니다',
      whatWeDoSubtitle: '글로벌 혁신 생태계의 연구자, 창업가 및 기술 리더들을 연결합니다.',
      viewAllCategories: '모든 분야 보기',
      theDiscoveryLayer: '디스커버리 레이어',
      koicaProgramBadge: 'KOICA 청년 리더 프로그램',
      howItWorksTitle: 'KoicaKonnect 운영 방식',
      howItWorksSubtitle: 'KOICA CONNECT는 의도적으로 일반 소셜 네트워크가 아닙니다. 끝없는 피드, 팔로워 경쟁, 알고리즘 함정이 없습니다. 진정한 인재를 발견하고 의미 있는 기회로 직접 연결됩니다.',
      step1Title: '1. 발견하기 (Discover)',
      step1Desc: '기존 소셜 네트워크의 불필요한 소음 없이 정밀한 전문 기술을 기반으로 전문가를 찾습니다.',
      step2Title: '2. 이해하기 (Understand)',
      step2Desc: '검증된 역량, 실제 관심 분야 및 검증된 산업 카테고리를 깊이 있게 확인합니다.',
      step3Title: '3. 연결하기 (Connect)',
      step3Desc: 'LinkedIn, GitHub 또는 포트폴리오로 직접 이동하여 신뢰성 있는 전문적 교류를 시작합니다.',
      qrPassNotice: '게시된 모든 프로필에는 고유한 스캔 가능 QR 디지털 신원 패스가 발급됩니다.',
      getDigitalIdentityBtn: '디지털 신원 패스 받기',
    },
    discover: {
      title: '인재 탐색',
      subtitle: '전문 기술, 관심 분야, 전문성 및 지역을 기반으로 동료 리더를 찾아보세요.',
      searchPlaceholder: '인재, 기술, 산업 또는 관심사 검색...',
      filterButton: '필터',
      clearFilters: '필터 초기화',
      categories: '카테고리',
      skills: '보유 기술',
      interests: '관심 분야',
      country: '국가',
      language: '사용 언어',
      allCategories: '모든 카테고리',
      allCountries: '모든 국가',
      allLanguages: '모든 언어',
      resultsFound: '명의 인재가 검색되었습니다',
      noResultsTitle: '검색 결과가 없습니다',
      noResultsDesc: '해당 조건과 일치하는 프로필을 찾을 수 없습니다. 검색어를 변경하거나 필터를 초기화해 보세요.',
      emptyNetworkTitle: '새로운 네트워크가 시작되었습니다.',
      emptyNetworkDesc: '회원들이 프로필을 작성하고 게시함에 따라 이곳에 표시됩니다. 가장 먼저 프로필을 등록해 보세요.',
      createProfileCta: '프로필 생성하기',
      viewProfile: '프로필 보기',
      exploreTalent: '인재 둘러보기',
      selectedSkills: '선택된 기술',
      addCustomSkill: '직접 기술 추가',
      selectFilter: '필터 선택...',
    },
    categoriesPage: {
      badge: '핵심 집중 분야',
      title: '산업 및 전공 분야별 탐색',
      subtitle: '데이터베이스 기반 산업 트랙별로 분류된 전문가, 연구원 및 기술 리더들을 만나보세요.',
      talentCount: '명의 리더',
      exploreTalent: '인재 둘러보기',
      noCategories: '현재 이용 가능한 카테고리가 없습니다.',
    },
    countriesPage: {
      badge: '글로벌 디렉터리 & 코호트 허브',
      title: '국가 및 지역별 탐색',
      subtitle: 'KOICA 5개 아프리카 파트너 국가 및 글로벌 혁신 거점의 리더, 연구원 및 전문가들과 연결하세요.',
      registeredLeaders: '게시된 리더',
      activeNations: '활동 중인 파트너 국가',
      primaryCohortTitle: '주요 아프리카 파트너 국가',
      primaryCohortSubtitle: 'KOICA 청년 리더 펠로우십 프로그램에 참여하는 핵심 파트너 국가입니다.',
      otherNationsTitle: '기타 참여 국가 및 글로벌 거점',
      otherNationsSubtitle: '글로벌 혁신 허브 및 디아스포라 네트워크에서 활동 중인 회원들입니다.',
      viewCountryTalent: '국가별 인재 보기',
    },
    profile: {
      viewLinkedIn: 'LinkedIn 프로필 보기',
      personalWebsite: '개인 웹사이트',
      github: 'GitHub 프로필',
      portfolio: '포트폴리오',
      skillsTitle: '보유 기술 및 역량',
      interestsTitle: '관심 분야',
      categoriesTitle: '산업 카테고리',
      languagesTitle: '구사 언어',
      aboutTitle: '자기소개 및 전문 이력',
      qrTitle: '전문가 신원 인증 QR',
      qrDesc: '이 코드를 스캔하면 KoicaKonnect 프로필에 바로 접속할 수 있습니다.',
      downloadQr: 'QR 다운로드',
      copyLink: '프로필 링크 복사',
      copied: '클립보드에 복사되었습니다!',
      translateTitle: '다국어 번역',
      translateTo: '언어 번역:',
      originalLanguage: '원문',
      translating: '번역 중...',
      translatedBadge: '번역됨',
      resetTranslation: '원문 보기',
      notFoundTitle: '프로필을 찾을 수 없습니다',
      notFoundDesc: '요청하신 프로필이 존재하지 않거나 아직 게시되지 않았습니다.',
      backToDiscover: '탐색 페이지로 돌아가기',
      draftOwnerNotice: '임시 저장 모드 — 본인에게만 표시됩니다',
      draftOwnerDesc: '현재 프로필은 임시 저장 상태입니다. 단계를 완료하고 게시하면 디스커버리 페이지에 공개됩니다.',
      completeAndPublish: '프로필 작성 완료 및 게시',
      shareProfile: '프로필 공유',
      verifiedLeader: '검증된 리더',
      contactAndLinks: '연락처 및 전문 링크',
    },
    profileBuilder: {
      pageTitle: '프로필 빌더',
      pageSubtitle: '디지털 신원 정보를 구축하고 글로벌 네트워크에서 발견되세요',
      saveDraftBtn: '임시 저장',
      savingBtn: '저장 중...',
      savedBtn: '저장됨!',
      saveError: '저장에 실패했습니다. 다시 시도해 주세요.',
      draftPrivateBadge: '임시 저장 (비공개)',
      publishedLiveBadge: '게시 완료 (공개 중)',
      draftBannerTitle: '현재 프로필은 비공개 상태입니다 (임시 저장 모드)',
      draftBannerDesc: '작성 중인 내용은 계정에 자동 저장됩니다. 8단계에서 게시하기를 누르면 탐색 디렉터리에 노출됩니다.',
      publishedBannerTitle: '프로필이 공개되었습니다',
      publishedBannerDesc: '이제 Koica Connect 검색 및 카테고리 필터를 통해 다른 사용자가 프로필을 찾을 수 있습니다.',
      stepOf: '8단계 중 {step}단계',
      step1Title: '1단계 — 기본 정보',
      step1Subtitle: 'Koica Connect에서 사용될 기본 신원 정보입니다',
      headshotLabel: '프로필 사진',
      uploadPhotoBtn: '프로필 사진 업로드',
      photoTip: '권장: 고화질 정사각형 PNG 또는 JPG 이미지 (최대 10MB).',
      fullNameLabel: '성명 (Full Name)',
      fullNamePlaceholder: '예: 홍길동, Dr. Ngozi Okonjo',
      usernameLabel: '사용자 아이디 (핸들)',
      roleLabel: '현재 직무 / 전문 분야',
      rolePlaceholder: '예: 소프트웨어 엔지니어, 경제학자',
      orgLabel: '소속 기관 / 기업',
      orgPlaceholder: '예: 세계무역기구, 테크 스타트업',
      countryLabel: '국가',
      selectCountry: '국가 선택...',
      cityLabel: '도시',
      cityPlaceholder: '예: 서울, 아부자, 다카르',
      step2Title: '2단계 — 소개 및 이력',
      step2Subtitle: '경력, 전문 경험 및 비전에 대한 전문 소개글을 작성해 주세요',
      bioLabel: '전문가 자기소개 (Bio)',
      bioPlaceholder: '경력 여정, 주요 성과, KOICA 펠로우십 경험 및 협력하고 싶은 관심 분야를 작성해 주세요...',
      bioTip: '팁: 충실한 소개글은 글로벌 파트너 및 동문들이 협력 기회를 제안하는 데 큰 도움이 됩니다.',
      preferredLangLabel: '선호하는 소통 언어',
      step3Title: '3단계 — 보유 기술 및 전문 역량',
      step3Subtitle: '핵심 역량 및 기술 스택을 선택하거나 추가하세요',
      selectedSkillsTitle: '선택된 보유 기술',
      noSkillsYet: '추가된 기술이 없습니다. 아래 목록에서 선택하거나 직접 입력하세요.',
      addCustomSkillLabel: '직접 기술 추가',
      addCustomSkillPlaceholder: '예: 지속가능 농업, 공공정책, 클라우드 아키텍처',
      addBtn: '추가',
      suggestedSkills: '추천 기술',
      step4Title: '4단계 — 관심 분야',
      step4Subtitle: '협력하고 싶은 프로젝트 주제나 관심 영역을 선택하세요',
      selectedInterestsTitle: '선택된 관심 분야',
      noInterestsYet: '추가된 관심 분야가 없습니다. 아래 목록에서 선택하거나 직접 입력하세요.',
      addCustomInterestLabel: '직접 관심 분야 추가',
      addCustomInterestPlaceholder: '예: 의료 AI, 재생에너지 마이크로그리드, 기후 금융',
      suggestedInterests: '추천 관심 분야',
      step5Title: '5단계 — 핵심 집중 분야',
      step5Subtitle: '본인의 전문성을 대표하는 KOICA 집중 분야 및 산업 카테고리를 선택하세요',
      step6Title: '6단계 — 구사 언어',
      step6Subtitle: '국제 교류 및 네트워킹에 사용할 구사 언어를 선택하세요',
      step7Title: '7단계 — 전문 소셜 및 포트폴리오 링크',
      step7Subtitle: 'LinkedIn, 웹사이트, GitHub 또는 포트폴리오를 연결하세요',
      linkedinLabel: 'LinkedIn 프로필 URL',
      websiteLabel: '개인 또는 소속 기관 웹사이트',
      githubLabel: 'GitHub 프로필 URL (선택사항)',
      portfolioLabel: '포트폴리오 / 논문 링크 (선택사항)',
      step8Title: '8단계 — 실시간 미리보기 및 게시',
      step8Subtitle: '프로필 카드와 디지털 패스가 어떻게 표시되는지 검토하세요',
      discoverCardPreview: '디스커버리 카드 미리보기',
      qrCardPreview: '디지털 QR 신원 패스 미리보기',
      readyToPublishTitle: '프로필을 공개할 준비가 되셨나요?',
      readyToPublishDesc: '게시하면 전문 기술, 산업 카테고리 및 키워드 검색을 통해 즉시 탐색됩니다.',
      publishNowBtn: '지금 프로필 게시하기',
      unpublishBtn: '비공개(임시 저장)로 전환',
      previousStepBtn: '이전 단계',
      saveAndContinueBtn: '저장 후 계속하기',
      viewPublicProfileBtn: '공개 프로필 보기',
      signInRequiredTitle: '로그인이 필요합니다',
      signInRequiredDesc: '프로필을 작성하고 수정하려면 KOICA CONNECT 계정에 로그인해 주세요.',
      signInToBuilderBtn: '프로필 빌더 로그인',
    },
    dashboard: {
      welcome: '환영합니다',
      welcomeSubtitle: '전문가 신원을 관리하고, 공개 상태를 확인하며, 프로필을 업데이트하세요.',
      completenessTitle: '프로필 완성도',
      completenessTip: '더 많은 기술과 외부 링크를 추가하여 프로필 발견 확률을 높이세요.',
      statusTitle: '프로필 공개 상태',
      statusPublished: '게시 완료 및 공개 중',
      statusDraft: '임시 저장 (비공개)',
      statusPrivate: '비공개',
      publishNow: '프로필 게시하기',
      unpublish: '임시 저장으로 전환',
      viewPublicProfile: '공개 프로필 보기',
      editProfile: '프로필 수정',
      qrCodeCard: '나의 KOICA CONNECT QR 패스',
      publicUrl: '공개 프로필 주소',
      shareCard: '디지털 패스 공유하기',
      quickStats: '개요',
    },
    qrPage: {
      title: '나의 KOICA CONNECT QR 코드',
      subtitle: '언제 어디서나 전문 신원을 공유하세요. 누구나 이 코드를 스캔하여 내 KOICA CONNECT 프로필을 확인할 수 있습니다.',
      downloadPng: 'PNG 패스 다운로드',
      downloadSvg: 'SVG 다운로드',
      copyUrl: '프로필 링크 복사',
      shareTitle: '디지털 신원 패스',
      useCasesTitle: '실제 활용 방법',
      useCase1: '컨퍼런스 명찰 및 네트워킹 밋업',
      useCase2: '명함 및 이력서 / 포트폴리오',
      useCase3: '발표 슬라이드 및 강연 자료',
      useCase4: '이메일 서명 및 개인 포트폴리오 웹사이트',
    },
    auth: {
      signInTitle: 'KOICA CONNECT 로그인',
      signInSubtitle: '다시 오신 것을 환영합니다! 계정 정보로 로그인하세요.',
      signUpTitle: 'KOICA CONNECT 회원가입',
      signUpSubtitle: '아프리카 전역 및 글로벌 거점의 동료 리더들과 함께하세요.',
      forgotPasswordTitle: '비밀번호 재설정',
      forgotPasswordSubtitle: '계정 이메일을 입력하시면 비밀번호 복구 안내를 보내드립니다.',
      resetPasswordTitle: '새 비밀번호 설정',
      resetPasswordSubtitle: '계정에 사용할 안전한 새 비밀번호를 입력해 주세요.',
      emailLabel: '이메일 주소',
      passwordLabel: '비밀번호',
      nameLabel: '성명',
      roleLabel: '현재 직무 / 전문 분야',
      orgLabel: '소속 기관 / 기업',
      countryLabel: '국가',
      cityLabel: '도시',
      forgotPasswordLink: '비밀번호를 잊으셨나요?',
      signInBtn: '로그인',
      signingInBtn: '로그인 중...',
      signUpBtn: '회원가입 완료',
      creatingAccountBtn: '계정 생성 중...',
      noAccountPrompt: '계정이 없으신가요?',
      createAccountLink: '지금 가입하기',
      haveAccountPrompt: '이미 계정이 있으신가요?',
      signInLink: '여기서 로그인',
      passwordRequirements: '비밀번호는 최소 8자 이상이어야 합니다.',
      accountDeactivatedTitle: '현재 비활성화된 계정입니다.',
      accountDeactivatedDesc: '오류라고 생각되시면 KOICA CONNECT 지원팀에 문의해 주세요.',
      loginSuccess: '로그인 성공! 대시보드로 이동합니다.',
      registerSuccess: '계정이 생성되었습니다. 프로필 빌더로 이동합니다...',
      resetLinkSent: '비밀번호 재설정 링크가 이메일로 전송되었습니다.',
      passwordResetSuccess: '비밀번호가 성공적으로 변경되었습니다. 다시 로그인해 주세요.',
      invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다. 다시 시도해 주세요.',
      emailAlreadyExists: '이미 등록된 이메일 주소입니다.',
      userNotFound: '등록되지 않은 이메일 주소입니다.',
    },
    settings: {
      title: '계정 설정',
      subtitle: '보안 자격 증명 및 계정 공개 상태를 관리하세요',
      accountInfoTitle: '계정 정보',
      dangerZoneTitle: '위험 설정 (Danger Zone)',
      dangerZoneDesc: '계정을 비활성화하면 공개 디렉터리 및 디지털 패스에서 프로필이 즉시 숨겨집니다.',
      deactivateBtn: '계정 비활성화',
      deactivateConfirm: '정말로 계정을 비활성화하시겠습니까?',
      deleteBtn: '계정 영구 삭제',
      deleteConfirm: '정말로 계정과 모든 데이터를 영구적으로 삭제하시겠습니까?',
    },
    footer: {
      manifesto: '네트워킹하기 전에 먼저 인재를 발견하세요. 아프리카 전역과 글로벌 협력 거점의 리더들을 연결하는 전문 신원 및 디스커버리 플랫폼입니다.',
      youthLeadersProgram: '청년 리더 프로그램',
      liveDirectory: '실시간 디렉터리',
      discoverSection: '탐색하기',
      searchDirectory: '인재 검색 디렉터리',
      focusDisciplines: '핵심 집중 분야',
      partnerNations: '파트너 국가',
      platformSection: '플랫폼',
      createProfile: '프로필 생성',
      signIn: '로그인',
      digitalPass: '디지털 패스 & QR',
      languageSection: '언어 선택',
      copyright: '© 2026 KOICA CONNECT. All rights reserved.',
      notASocialNetwork: '소셜 네트워크가 아닙니다. 피드나 알고리즘 없이 인재를 발견하세요.',
    },
  },
};
