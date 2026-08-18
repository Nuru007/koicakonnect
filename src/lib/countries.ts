export interface CountryOption {
  name: string;
  code: string;
  flag: string;
  region?: string;
}

export const COUNTRIES: CountryOption[] = [
  // Primary KOICA African Partner Countries
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬', region: 'West Africa' },
  { name: 'Senegal', code: 'SN', flag: '🇸🇳', region: 'West Africa' },
  { name: 'Ghana', code: 'GH', flag: '🇬🇭', region: 'West Africa' },
  { name: "Côte d'Ivoire", code: 'CI', flag: '🇨🇮', region: 'West Africa' },
  { name: 'Cameroon', code: 'CM', flag: '🇨🇲', region: 'Central Africa' },
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

export const getCountryFlag = (countryName: string): string => {
  if (!countryName) return '📍';
  const match = COUNTRIES.find(
    (c) => c.name.toLowerCase() === countryName.trim().toLowerCase()
  );
  return match ? match.flag : '📍';
};
