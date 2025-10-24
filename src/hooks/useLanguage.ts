import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { SupportedLanguage, LANGUAGES } from '../types/i18n';
import { LANGUAGE_STORAGE_KEY } from '../i18n/config';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.language as SupportedLanguage;

  const changeLanguage = useCallback(
    (language: SupportedLanguage) => {
      i18n.changeLanguage(language);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    },
    [i18n]
  );

  const getLanguageInfo = useCallback((lang: SupportedLanguage) => {
    return LANGUAGES[lang];
  }, []);

  return {
    currentLanguage,
    changeLanguage,
    getLanguageInfo,
    t,
    languages: LANGUAGES,
  };
};
