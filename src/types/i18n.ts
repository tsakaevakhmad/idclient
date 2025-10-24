export type SupportedLanguage = 'en' | 'ru' | 'kg';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Record<SupportedLanguage, LanguageInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
  },
  kg: {
    code: 'kg',
    name: 'Kyrgyz',
    nativeName: 'Кыргызча',
    flag: '🇰🇬',
  },
};
