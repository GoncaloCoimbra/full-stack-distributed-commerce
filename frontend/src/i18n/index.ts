/**
 * i18n Configuration
 * Internacionalização completa PT/EN para website nível empresa
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ptTranslations from './locales/pt.json';
import enTranslations from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: ptTranslations },
      en: { translation: enTranslations },
    },
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

// Salvar escolha de idioma
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('site-language', lng);
  document.documentElement.lang = lng;
});

export default i18n;
