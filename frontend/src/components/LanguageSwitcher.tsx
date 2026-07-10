/**
 * Language Switcher Component
 * Integrated with i18next for global translation support (PT ↔ EN ↔ ES)
 */

import React, { useState, useEffect } from 'react';
import './LanguageSwitcher.css';
import i18n from '../i18n';

type Language = 'pt' | 'en' | 'es';

const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('site-language');
    if (stored === 'en' || stored === 'es') return stored;
    return 'pt' as Language;
  });

  useEffect(() => {
    const lang = ((i18n.resolvedLanguage || i18n.language || localStorage.getItem('site-language') || 'pt').split('-')[0] as Language);
    const normalized = (lang === 'en' || lang === 'es') ? lang : 'pt';
    setCurrentLanguage(normalized);
    if (normalized !== i18n.language) {
      void i18n.changeLanguage(normalized);
    }
  }, []);

  const handleLanguageChange = async (lang: Language) => {
    const normalized = (lang === 'en' || lang === 'es') ? lang : 'pt';
    await i18n.changeLanguage(normalized);
    setCurrentLanguage(normalized);
    localStorage.setItem('site-language', normalized);
    document.documentElement.lang = lang;
    setIsOpen(false);
  };

  return (
    <div className="language-switcher">
      <button
        className="language-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title={`Mudar idioma / Change language`}
        aria-label="Language selector"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="language-code">{currentLanguage.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          <button
            className={`language-option ${currentLanguage === 'pt' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('pt')}
          >
            <span className="flag">🇵🇹</span>
            <span>Português</span>
          </button>
          <button
            className={`language-option ${currentLanguage === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('en')}
          >
            <span className="flag">🇬🇧</span>
            <span>English</span>
          </button>
          <button
            className={`language-option ${currentLanguage === 'es' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('es')}
          >
            <span className="flag">🇪🇸</span>
            <span>Español</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
