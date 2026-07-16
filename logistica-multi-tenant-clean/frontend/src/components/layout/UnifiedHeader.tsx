import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage, translateText, TRANSLATIONS } from '../../i18n';
import { SITE_FULL_NAME } from '../../site.config';
import NotificationPanel from '../NotificationPanel';
import './UnifiedHeader.css';

interface UnifiedHeaderProps {
  variant?: 'admin' | 'public';
  darkMode?: boolean;
  onThemeToggle?: () => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ variant = 'admin', darkMode = false, onThemeToggle }) => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const { language, setLanguage } = useLanguage();

  const t = (key: keyof typeof TRANSLATIONS) => translateText(TRANSLATIONS[key], language);

  return (
    <header className="unified-header">
      <div className="header-content">
        {/* Brand */}
        <div className="brand-section">
          <Link to="/dashboard" className="brand-link flex items-center gap-3">
            <div className="brand-logo h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg flex items-center justify-center text-black font-black">
              L
            </div>
            <div>
              <div className="text-lg font-bold text-white">{SITE_FULL_NAME}</div>
              <div className="text-xs uppercase tracking-[0.35em] text-amber-300">Logistics Platform</div>
            </div>
          </Link>
        </div>

        {/* Right Section */}
        <div className="header-actions">
          <NotificationPanel />

          <div className="language-menu">
            <button
              type="button"
              className="language-current"
              title={language === 'pt' ? 'Português' : language === 'en' ? 'English' : 'Español'}
            >
              {language.toUpperCase()}
            </button>
            <div className="language-dropdown">
              {(['pt', 'en', 'es'] as const)
                .filter((lang) => lang !== language)
                .map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className="language-option"
                    onClick={() => setLanguage(lang)}
                    title={lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : 'Español'}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
            </div>
          </div>

          <button
            type="button"
            className="header-btn icon-button theme-toggle"
            onClick={onThemeToggle}
            title={t('themeToggleTitle')}
            aria-label={t('themeToggleTitle')}
          >
            {darkMode ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4 12h2M18 12h2M5.64 5.64l1.42 1.42M17.66 17.66l1.42 1.42M5.64 18.36l1.42-1.42M17.66 6.34l1.42-1.42" />
              </svg>
            )}
          </button>

          <div className="header-user">
            {user && <span className="user-name">{user.name || user.email}</span>}
            <button
              type="button"
              className="header-btn icon-button user-menu-btn"
              onClick={() => setShowMenu(!showMenu)}
              title={t('userMenuTitle')}
              aria-label={t('userMenuTitle')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="3" />
                <path d="M5.5 20c0-2.485 2.015-4.5 4.5-4.5h4c2.485 0 4.5 2.015 4.5 4.5" />
              </svg>
            </button>

            {showMenu && (
              <div className="user-dropdown">
                <Link to="/profile" className="dropdown-item">{t('headerProfile')}</Link>
                <Link to="/configuracoes" className="dropdown-item">{t('headerSettings')}</Link>
                <hr className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item logout-btn"
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                >
                  {t('headerLogout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;