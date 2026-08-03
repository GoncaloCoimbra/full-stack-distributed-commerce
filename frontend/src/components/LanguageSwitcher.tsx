/**
 * Language Switcher Component
 * Integrated with i18next for global translation support (PT ↔ EN ↔ ES)
 */

import React, { useEffect, useState } from 'react';
import './LanguageSwitcher.css';
import i18n from '../i18n';

type Language = 'pt' | 'en' | 'es';

const normalizeLanguage = (lang: string | null | undefined): Language => {
  if (lang === 'en' || lang === 'es') return lang;
  return 'pt';
};

const LanguageSwitcher: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    return normalizeLanguage(localStorage.getItem('site-language'));
  });

  useEffect(() => {
    const lang = normalizeLanguage(
      (i18n.resolvedLanguage || i18n.language || localStorage.getItem('site-language') || 'pt').split('-')[0]
    );

    setCurrentLanguage(lang);
    if (lang !== i18n.language) {
      void i18n.changeLanguage(lang);
    }
  }, []);

  const handleLanguageChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLanguage = normalizeLanguage(event.target.value);
    await i18n.changeLanguage(nextLanguage);
    setCurrentLanguage(nextLanguage);
    localStorage.setItem('site-language', nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  return (
    <div className="language-switcher">
      <label className="language-label" htmlFor="site-language-select">
        Language
      </label>
      <select
        id="site-language-select"
        className="language-select"
        value={currentLanguage}
        onChange={handleLanguageChange}
        aria-label="Language"
      >
        <option value="pt">Português</option>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
