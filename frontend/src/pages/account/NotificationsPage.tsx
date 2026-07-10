import React, { useEffect, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

const options = [
  { id: 'email', label: 'Notificações por email', description: 'Receba atualizações de encomendas, promoções e faturas no seu email.' },
  { id: 'push', label: 'Notificações push', description: 'Alertas imediatos no browser ou aplicação móvel.' },
  { id: 'sms', label: 'SMS', description: 'Receba avisos importantes por mensagem de texto.' },
  { id: 'marketing', label: 'Ofertas e promoções', description: 'Envio de newsletters e campanhas exclusivas.' },
];

export default function NotificationsPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    email: true,
    push: false,
    sms: false,
    marketing: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem('account-notifications');
    if (stored) {
      try { setSettings(JSON.parse(stored)); } catch {}
    }
  }, []);

  const updateSetting = (id: string) => {
    setSettings(prev => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem('account-notifications', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AppLayout title="Notificações" description="Configure como recebe alertas da sua conta Tranzor." canonical="/account/notifications">
      <section className="page-hero">
        <h1>Notificações</h1>
        <p className="page-copy">
          Personalize os canais de comunicação que deseja receber da Tranzor para encomendas, faturas e promoções.
        </p>
      </section>

      <section className="container page-card" style={{ marginBottom: '2rem' }}>
        <div className="alert alert-info">
          <span className="alert-icon">i</span>
          <div>As preferências são guardadas automaticamente no seu navegador.</div>
        </div>
      </section>

      <section className="container page-grid" style={{ gap: '1.5rem' }}>
        {options.map(option => (
          <label key={option.id} className="page-card" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{option.label}</strong>
                <p className="page-copy" style={{ marginTop: '0.5rem' }}>{option.description}</p>
              </div>
              <input
                type="checkbox"
                checked={settings[option.id]}
                onChange={() => updateSetting(option.id)}
                aria-label={option.label}
              />
            </div>
          </label>
        ))}
      </section>
    </AppLayout>
  );
}
