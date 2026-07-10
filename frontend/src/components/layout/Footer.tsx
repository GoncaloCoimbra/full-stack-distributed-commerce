import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer style={{
      background: "var(--charcoal-2, #1a1a1a)",
      borderTop: "1px solid var(--border, rgba(255,255,255,0.1))",
      padding: "3rem 2rem",
      color: "var(--muted, #888)",
      fontFamily: "var(--font-display, sans-serif)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "var(--red, #d90429)", marginBottom: 8 }}>Tranzor</div>
          <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>{t('footer.description')}</p>
        </div>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12, color: "var(--text, white)" }}>{t('footer.shopTitle')}</div>
            {[[t('footer.catalog'), "/shop"], [t('footer.promotions'), "/shop/ofertas"], [t('footer.schoolSupplies'), "/shop/escolar"]].map(([label, to]) => (
              <div key={to} style={{ marginBottom: 8 }}>
                <Link to={to} style={{ color: "var(--muted, #888)", textDecoration: "none", fontSize: 13 }}>{label}</Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12, color: "var(--text, white)" }}>{t('footer.companyTitle')}</div>
            {[[t('footer.about'), "/about"], [t('footer.contact'), "/contact"], [t('footer.faq'), "/faq"]].map(([label, to]) => (
              <div key={to} style={{ marginBottom: 8 }}>
                <Link to={to} style={{ color: "var(--muted, #888)", textDecoration: "none", fontSize: 13 }}>{label}</Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12, color: "var(--text, white)" }}>{t('footer.legalTitle')}</div>
            {[[t('footer.privacy'), "/privacy"], [t('footer.terms'), "/terms"], [t('footer.cookies'), "/cookies"]].map(([label, to]) => (
              <div key={to} style={{ marginBottom: 8 }}>
                <Link to={to} style={{ color: "var(--muted, #888)", textDecoration: "none", fontSize: 13 }}>{label}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: "2rem auto 0", paddingTop: "1.5rem", borderTop: "1px solid var(--border, rgba(255,255,255,0.1))", fontSize: 12, textAlign: "center" }}>
        © {new Date().getFullYear()} Tranzor — {t('footer.copyright')}
      </div>
    </footer>
  );
}