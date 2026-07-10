import React from 'react';

const TIERS = [
  {
    name: 'Essencial',
    price: 'a partir de 2%',
    description: 'Ideal para empresas que compram volume ocasionalmente e querem condições preferenciais.',
    features: [
      'Desconto empresarial automático',
      'Suporte prioritário até 24h',
      'Acesso ao portal B2B',
    ]
  },
  {
    name: 'Profissional',
    price: 'a partir de 5%',
    description: 'Para compras regulares com volume médio e faturação simplificada.',
    features: [
      'Desconto maior para compras recorrentes',
      'Condições de pagamento a 30 dias',
      'Relatórios de consumo mensais',
    ]
  },
  {
    name: 'Enterprise',
    price: 'personalizado',
    description: 'Solução personalizada para grandes empresas e distribuidoras com contratos dedicados.',
    features: [
      'Condições comerciais personalizadas',
      'Gestor de conta dedicado',
      'Entrega e embalamento premium',
    ]
  }
];

export default function B2BPricingTable() {
  return (
    <section style={{ padding: '3rem 0', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <p className="section-label">Plano Empresarial</p>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 2.8rem)' }}>Preços corporativos claros e escaláveis</h2>
        <p style={{ maxWidth: 720, margin: '1rem auto 0', color: 'var(--muted)', lineHeight: 1.8 }}>
          Escolha a solução B2B que melhor se adapta à sua empresa: desde compras pontuais até contratos de fornecimento com preços e condições personalizadas.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {TIERS.map((tier) => (
          <article key={tier.name} style={{ background: 'var(--charcoal-2)', border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.35rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{tier.name}</h3>
              <p style={{ margin: '0.75rem 0 1.5rem', fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{tier.description}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--red)' }}>{tier.price}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>Desconto aplicado sobre preço de catálogo</span>
              </div>

              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
                {tier.features.map((feature) => (
                  <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text)' }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--red)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>✓</span>
                    <span style={{ fontSize: 14 }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button type="button" className="btn-primary" style={{ marginTop: '1.5rem' }}>
              Saiba mais
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
