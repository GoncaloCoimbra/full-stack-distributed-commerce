import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import B2BPricingTable from '../../components/b2b/B2BPricingTable';

const heroStats = [
  { label: 'Desconto exclusivo', value: 'até 20%' },
  { label: 'Tempo médio de resposta', value: '24h' },
  { label: 'Clientes B2B ativos', value: '150+' }
];

const benefits = [
  {
    title: 'Preços especiais',
    description: 'Descontos exclusivos para empresas, revendedores e instituições.'
  },
  {
    title: 'Entrega dedicada',
    description: 'Logística adaptada para grandes volumes e prazos de reposição mais curtos.'
  },
  {
    title: 'Suporte prioritário',
    description: 'Gestor de conta dedicado e contacto empresarial com atenção rápida.'
  },
  {
    title: 'Condições de pagamento',
    description: 'Prazos ajustados e opções financeiras para clientes aprovados.'
  },
  {
    title: 'Encomendas a granel',
    description: 'Estruturas flexíveis para pedidos recorrentes e necessidades de stock.'
  },
  {
    title: 'Relatórios de consumo',
    description: 'Dados para controlar custos, opinar compras e planejar reposição.'
  }
];

const testimonials = [
  {
    quote: 'A Tranzor é o nosso parceiro de confiança há mais de 10 anos. A qualidade dos produtos e o serviço são excecionais.',
    author: 'Maria Santos',
    role: 'Directora de Compras, Empresa XYZ',
    company: 'Empresa com 200+ funcionários'
  },
  {
    quote: 'Os preços competitivos e a entrega pontual fazem toda a diferença no nosso negócio diário.',
    author: 'João Pereira',
    role: 'Gestor de Armazém, ABC Ltd',
    company: 'Distribuidora nacional'
  }
];

export default function B2BLandingPage() {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    employees: '',
    message: ''
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Obrigado pelo seu pedido. A nossa equipa empresarial contactará em breve.');
    setFormData({
      company: '',
      name: '',
      email: '',
      phone: '',
      employees: '',
      message: ''
    });
  };

  return (
    <AppLayout
      title="Acesso Empresarial Tranzor"
      description="Soluções empresariais Tranzor para empresas e revendedores. Preços especiais, entrega dedicada e suporte prioritário."
      canonical="/b2b"
    >
      <section
        className="page-hero"
        style={{
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '3.5rem',
          paddingBottom: '3rem',
          borderRadius: '24px',
          margin: '1rem auto 2rem'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-10% auto auto -8%',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217,4,41,0.23), transparent 68%)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 'auto -6% -14% auto',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217,4,41,0.18), transparent 68%)',
            pointerEvents: 'none'
          }}
        />

        <p className="section-label">Soluções Empresa</p>
        <h1 style={{ maxWidth: 780 }}>Área Empresarial B2B</h1>
        <p className="page-copy" style={{ fontSize: '1.08rem', marginBottom: '1.5rem' }}>
          Soluções dedicadas para empresas, revendedores e instituições que precisam de volume, faturação simplificada e suporte prioritário.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
          <a href="/auth/b2b/register" className="btn-primary">Criar conta B2B</a>
          <a href="/b2b/quote-request" className="btn-secondary">Pedir orçamento</a>
        </div>
      </section>

      <section className="container" style={{ marginBottom: '3rem' }}>
        <div className="page-grid page-grid-3">
          {heroStats.map((stat) => (
            <article key={stat.label} className="page-card" style={{ padding: '1.5rem 1.25rem' }}>
              <p className="section-label" style={{ marginBottom: '0.75rem' }}>{stat.label}</p>
              <div className="kpi-value" style={{ fontSize: '1.8rem' }}>{stat.value}</div>
            </article>
          ))}
        </div>
      </section>

      <B2BPricingTable />

      <section className="container" style={{ marginBottom: '4rem' }}>
        <div className="page-panel">
          <div className="page-grid page-grid-2" style={{ gap: '1.5rem', alignItems: 'stretch' }}>
            <div>
              <p className="section-label">Por que escolher Tranzor</p>
              <h2 className="page-heading" style={{ marginBottom: '1rem' }}>Uma experiência B2B pensada para escalar</h2>
              <p className="page-copy" style={{ marginBottom: '1.5rem' }}>
                Combine previsão de consumo, condições comerciais adaptadas e um suporte direto para o seu time de compras.
              </p>
              <div style={{ display: 'grid', gap: '0.85rem' }}>
                {[
                  'Condições de pagamento personalizadas para clientes B2B aprovados.',
                  'Encomendas a granel com embalagens e etiquetagem específicas.',
                  'Relatórios de consumo e análise de pedidos para controlo de gastos.'
                ].map((item) => (
                  <div key={item} className="page-card" style={{ padding: '1rem 1.1rem' }}>
                    <p className="page-copy" style={{ margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="page-grid page-grid-2" style={{ gap: '1rem' }}>
              {benefits.map((benefit, index) => (
                <article key={index} className="page-card">
                  <h3 className="page-heading" style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>{benefit.title}</h3>
                  <p className="page-copy" style={{ marginBottom: 0 }}>{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container page-grid page-grid-2" style={{ marginBottom: '4rem' }}>
        {testimonials.map((testimonial, index) => (
          <article key={index} className="page-card">
            <p className="page-copy" style={{ fontStyle: 'italic', marginBottom: '1.2rem' }}>
              {testimonial.quote}
            </p>
            <div>
              <div className="page-heading" style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{testimonial.author}</div>
              <p className="page-copy" style={{ marginBottom: '0.25rem' }}>{testimonial.role}</p>
              <p className="page-copy" style={{ color: 'var(--muted)' }}>{testimonial.company}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="container page-panel" style={{ marginBottom: '4rem' }}>
        <p className="section-label">Solicite um orçamento</p>
        <h2 className="page-heading" style={{ marginBottom: '0.75rem' }}>Fale com o nosso time empresarial</h2>
        <p className="page-copy" style={{ marginBottom: '2rem' }}>
          Preencha os dados da sua empresa e receba uma proposta em até 24 horas. O nosso atendimento B2B está preparado para responder rapidamente.
        </p>

        {statusMessage && (
          <div className="alert alert-success" role="status" style={{ marginBottom: '1.5rem' }}>
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem', maxWidth: '900px' }}>
          <div className="page-grid page-grid-2" style={{ gap: '1rem' }}>
            <div>
              <label className="form-label">Nome da Empresa *</label>
              <input className="form-input" type="text" name="company" required value={formData.company} onChange={handleInputChange} />
            </div>
            <div>
              <label className="form-label">Seu Nome *</label>
              <input className="form-input" type="text" name="name" required value={formData.name} onChange={handleInputChange} />
            </div>
          </div>

          <div className="page-grid page-grid-2" style={{ gap: '1rem' }}>
            <div>
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" name="email" required value={formData.email} onChange={handleInputChange} />
            </div>
            <div>
              <label className="form-label">Telefone *</label>
              <input className="form-input" type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} />
            </div>
          </div>

          <div className="page-grid page-grid-2" style={{ gap: '1rem' }}>
            <div>
              <label className="form-label">Número de Funcionários</label>
              <select className="form-input" name="employees" value={formData.employees} onChange={handleInputChange}>
                <option value="">Selecionar...</option>
                <option value="1-10">1-10 funcionários</option>
                <option value="11-50">11-50 funcionários</option>
                <option value="51-200">51-200 funcionários</option>
                <option value="201-500">201-500 funcionários</option>
                <option value="500+">Mais de 500 funcionários</option>
              </select>
            </div>
            <div>
              <label className="form-label">Mensagem / Produtos de Interesse</label>
              <textarea
                className="form-input"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Descreva os produtos ou serviços que procura..."
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Solicitar Orçamento
          </button>
        </form>
      </section>
    </AppLayout>
  );
}
