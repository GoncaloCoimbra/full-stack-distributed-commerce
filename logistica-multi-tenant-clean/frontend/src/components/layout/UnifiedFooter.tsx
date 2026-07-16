import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, translateText, TRANSLATIONS } from '../../i18n';

const UnifiedFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const { language } = useLanguage();
  const t = (key: keyof typeof TRANSLATIONS) => translateText(TRANSLATIONS[key], language);

  return (
    <footer className="layout-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} LogiSphere Logística. Todos os direitos reservados.</p>
        <div className="footer-links">
          <Link to="/privacy-policy">{t('footerPrivacy')}</Link>
          <span className="divider">•</span>
          <Link to="/terms-of-use">{t('footerTerms')}</Link>
          <span className="divider">•</span>
          <Link to="/help">{t('footerContact')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default UnifiedFooter;
