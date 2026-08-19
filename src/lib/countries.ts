export interface CountryOption {
  name: string;
  code: string;
  flag: string;
  flagImg?: string;
  region?: string;
}

// Primary KOICA African Partner Countries (Cohort Focus)
export const PRIMARY_AFRICAN_COUNTRIES: CountryOption[] = [
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬', flagImg: '/flags/nigeria.jpg', region: 'West Africa' },
  { name: 'Cameroon', code: 'CM', flag: '🇨🇲', flagImg: '/flags/cameroon.jpg', region: 'Central Africa' },
  { name: 'Ghana', code: 'GH', flag: '🇬🇭', flagImg: '/flags/ghana.png', region: 'West Africa' },
  { name: 'Senegal', code: 'SN', flag: '🇸🇳', flagImg: '/flags/senegal.jpg', region: 'West Africa' },
  { name: "Côte d'Ivoire", code: 'CI', flag: '🇨🇮', flagImg: '/flags/cote-divoire.svg', region: 'West Africa' },
];

export const COUNTRIES: CountryOption[] = [
  // Primary KOICA African Partner Countries
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬', flagImg: '/flags/nigeria.jpg', region: 'West Africa' },
  { name: 'Cameroon', code: 'CM', flag: '🇨🇲', flagImg: '/flags/cameroon.jpg', region: 'Central Africa' },
  { name: 'Ghana', code: 'GH', flag: '🇬🇭', flagImg: '/flags/ghana.png', region: 'West Africa' },
  { name: 'Senegal', code: 'SN', flag: '🇸🇳', flagImg: '/flags/senegal.jpg', region: 'West Africa' },
  { name: "Côte d'Ivoire", code: 'CI', flag: '🇨🇮', flagImg: '/flags/cote-divoire.svg', region: 'West Africa' },
  { name: 'Kenya', code: 'KE', flag: '🇰🇪', region: 'East Africa' },
  { name: 'Rwanda', code: 'RW', flag: '🇷🇼', region: 'East Africa' },
  { name: 'Ethiopia', code: 'ET', flag: '🇪🇹', region: 'East Africa' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦', region: 'Southern Africa' },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬', region: 'North Africa' },
  { name: 'Tanzania', code: 'TZ', flag: '🇹🇿', region: 'East Africa' },
  { name: 'Uganda', code: 'UG', flag: '🇺🇬', region: 'East Africa' },
  { name: 'Morocco', code: 'MA', flag: '🇲🇦', region: 'North Africa' },
  { name: 'Algeria', code: 'DZ', flag: '🇩🇿', region: 'North Africa' },
  { name: 'Angola', code: 'AO', flag: '🇦🇴', region: 'Southern Africa' },
  { name: 'Benin', code: 'BJ', flag: '🇧🇯', region: 'West Africa' },
  { name: 'Botswana', code: 'BW', flag: '🇧🇼', region: 'Southern Africa' },
  { name: 'Burkina Faso', code: 'BF', flag: '🇧🇫', region: 'West Africa' },
  { name: 'Burundi', code: 'BI', flag: '🇧🇮', region: 'East Africa' },
  { name: 'Cabo Verde', code: 'CV', flag: '🇨🇻', region: 'West Africa' },
  { name: 'Chad', code: 'TD', flag: '🇹🇩', region: 'Central Africa' },
  { name: 'Comoros', code: 'KM', flag: '🇰🇲', region: 'East Africa' },
  { name: 'Congo', code: 'CG', flag: '🇨🇬', region: 'Central Africa' },
  { name: 'Democratic Republic of the Congo', code: 'CD', flag: '🇨🇩', region: 'Central Africa' },
  { name: 'Djibouti', code: 'DJ', flag: '🇩🇯', region: 'East Africa' },
  { name: 'Equatorial Guinea', code: 'GQ', flag: '🇬🇶', region: 'Central Africa' },
  { name: 'Eritrea', code: 'ER', flag: '🇪🇷', region: 'East Africa' },
  { name: 'Eswatini', code: 'SZ', flag: '🇸🇿', region: 'Southern Africa' },
  { name: 'Gabon', code: 'GA', flag: '🇬🇦', region: 'Central Africa' },
  { name: 'Gambia', code: 'GM', flag: '🇬🇲', region: 'West Africa' },
  { name: 'Guinea', code: 'GN', flag: '🇬🇳', region: 'West Africa' },
  { name: 'Guinea-Bissau', code: 'GW', flag: '🇬🇼', region: 'West Africa' },
  { name: 'Lesotho', code: 'LS', flag: '🇱🇸', region: 'Southern Africa' },
  { name: 'Liberia', code: 'LR', flag: '🇱🇷', region: 'West Africa' },
  { name: 'Madagascar', code: 'MG', flag: '🇲🇬', region: 'East Africa' },
  { name: 'Malawi', code: 'MW', flag: '🇲🇼', region: 'Southern Africa' },
  { name: 'Mali', code: 'ML', flag: '🇲🇱', region: 'West Africa' },
  { name: 'Mauritania', code: 'MR', flag: '🇲🇷', region: 'West Africa' },
  { name: 'Mauritius', code: 'MU', flag: '🇲🇺', region: 'East Africa' },
  { name: 'Mozambique', code: 'MZ', flag: '🇲🇿', region: 'Southern Africa' },
  { name: 'Namibia', code: 'NA', flag: '🇳🇦', region: 'Southern Africa' },
  { name: 'Niger', code: 'NE', flag: '🇳🇪', region: 'West Africa' },
  { name: 'São Tomé and Príncipe', code: 'ST', flag: '🇸🇹', region: 'Central Africa' },
  { name: 'Seychelles', code: 'SC', flag: '🇸🇨', region: 'East Africa' },
  { name: 'Sierra Leone', code: 'SL', flag: '🇸🇱', region: 'West Africa' },
  { name: 'Somalia', code: 'SO', flag: '🇸🇴', region: 'East Africa' },
  { name: 'South Sudan', code: 'SS', flag: '🇸🇸', region: 'East Africa' },
  { name: 'Sudan', code: 'SD', flag: '🇸🇩', region: 'North Africa' },
  { name: 'Togo', code: 'TG', flag: '🇹🇬', region: 'West Africa' },
  { name: 'Tunisia', code: 'TN', flag: '🇹🇳', region: 'North Africa' },
  { name: 'Zambia', code: 'ZM', flag: '🇿🇲', region: 'Southern Africa' },
  { name: 'Zimbabwe', code: 'ZW', flag: '🇿🇼', region: 'Southern Africa' },
  
  // KOICA Headquarters & International Fellowship
  { name: 'South Korea', code: 'KR', flag: '🇰🇷', region: 'Asia' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', region: 'Europe' },
  { name: 'United States', code: 'US', flag: '🇺🇸', region: 'Americas' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', region: 'Americas' },
  { name: 'France', code: 'FR', flag: '🇫🇷', region: 'Europe' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', region: 'Europe' },
  { name: 'Other', code: 'OTHER', flag: '🌐', region: 'Global' },
];

/**
 * Normalizes any country name or code representation into the canonical country name.
 * Handles accents, case sensitivity, aliases (e.g. Cote d'Ivoire, Cameroun, Korea, etc.).
 */
export function normalizeCountry(input: string): string {
  if (!input) return '';
  const clean = input.trim();
  if (!clean) return '';

  const cleanLower = clean.toLowerCase();

  // Normalize apostrophes and remove diacritics/accents for robust matching
  const simplified = cleanLower
    .replace(/[\u2018\u2019`]/g, "'")
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Alias lookup map
  const aliases: Record<string, string> = {
    'cameroun': 'Cameroon',
    'cameroon': 'Cameroon',
    'cm': 'Cameroon',
    'nigeria': 'Nigeria',
    'ng': 'Nigeria',
    'ghana': 'Ghana',
    'gh': 'Ghana',
    'senegal': 'Senegal',
    'sn': 'Senegal',
    'cote d\'ivoire': "Côte d'Ivoire",
    'cote divoire': "Côte d'Ivoire",
    'cote d ivoire': "Côte d'Ivoire",
    'ivory coast': "Côte d'Ivoire",
    'ci': "Côte d'Ivoire",
    'korea': 'South Korea',
    'south korea': 'South Korea',
    'republic of korea': 'South Korea',
    'kr': 'South Korea',
    'usa': 'United States',
    'us': 'United States',
    'united states': 'United States',
    'united states of america': 'United States',
    'uk': 'United Kingdom',
    'gb': 'United Kingdom',
    'great britain': 'United Kingdom',
    'united kingdom': 'United Kingdom',
    'drc': 'Democratic Republic of the Congo',
    'dr congo': 'Democratic Republic of the Congo',
  };

  if (aliases[simplified]) {
    return aliases[simplified];
  }

  // Exact / partial match against COUNTRIES
  const match = COUNTRIES.find((c) => {
    const cNorm = c.name
      .toLowerCase()
      .replace(/[\u2018\u2019`]/g, "'")
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return cNorm === simplified || c.code.toLowerCase() === cleanLower;
  });

  if (match) return match.name;

  // Fallback to title casing if unknown custom string
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export const getCountryOption = (countryName: string): CountryOption | undefined => {
  if (!countryName) return undefined;
  const canonical = normalizeCountry(countryName);
  return COUNTRIES.find(
    (c) => c.name.toLowerCase() === canonical.toLowerCase() || c.code.toLowerCase() === countryName.trim().toLowerCase()
  );
};

export const getCountryFlag = (countryName: string): string => {
  if (!countryName) return '📍';
  const match = getCountryOption(countryName);
  return match ? match.flag : '📍';
};

export const getCountryFlagImg = (countryName: string): string | undefined => {
  if (!countryName) return undefined;
  const match = getCountryOption(countryName);
  return match?.flagImg;
};

export const getCountryCode = (countryName: string): string => {
  if (!countryName) return 'GL';
  const match = getCountryOption(countryName);
  return match ? match.code : countryName.slice(0, 2).toUpperCase();
};

