import React from 'react';

const UnifiedFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="layout-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Tranzor Logística. Todos os direitos reservados.</p>
        <div className="footer-links">
          <a href="/privacy">Privacidade</a>
          <span className="divider">•</span>
          <a href="/terms">Termos</a>
          <span className="divider">•</span>
          <a href="/contact">Contacto</a>
        </div>
      </div>
    </footer>
  );
};

export default UnifiedFooter;
