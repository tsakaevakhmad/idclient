import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en/translation.json';
import ruTranslation from '../locales/ru/translation.json';
import kgTranslation from '../locales/kg/translation.json';
import trTranslation from '../locales/tr/translation.json';

export const SUPPORTED_LANGUAGES = ['en', 'ru', 'kg', 'tr'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_STORAGE_KEY = 'app-language';
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

const resources = {
  en: {
    translation: enTranslation,
  },
  ru: {
    translation: ruTranslation,
  },
  kg: {
    translation: kgTranslation,
  },
  tr: {
    translation: trTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    lng: localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE,
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },
  });

export default i18n;
