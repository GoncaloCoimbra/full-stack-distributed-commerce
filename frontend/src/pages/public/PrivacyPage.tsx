import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';

/* ─── Section anchor helper ─── */
const SECTIONS = [
  { id: 'compromisso',    label: 'Compromisso' },
  { id: 'recolha',        label: 'Dados recolhidos' },
  { id: 'finalidade',     label: 'Finalidade' },
  { id: 'partilha',       label: 'Partilha' },
  { id: 'retencao',       label: 'Retenção' },
  { id: 'direitos',       label: 'Os seus direitos' },
  { id: 'cookies',        label: 'Cookies' },
  { id: 'contacto',       label: 'Contacto DPO' },
];

/* ─── Sticky TOC ─── */
function TableOfContents() {
  const [active, setActive] = useState('compromisso');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-30% 0px -60% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <aside
      aria-label="Índice da página"
      style={{
        position: 'sticky',
        top: 104 + 32,
        alignSelf: 'flex-start',
        padding: '2rem',
        background: 'var(--charcoal-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        minWidth: 220,
      }}
    >
      <p style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 10,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: 'var(--red)',
        marginBottom: 20,
      }}>Índice</p>
      <nav aria-label="Secções da política de privacidade">
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '7px 10px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-display)',
                  fontWeight: active === id ? 700 : 500,
                  fontSize: 13,
                  color: active === id ? 'var(--white)' : 'var(--muted-light)',
                  background: active === id ? 'rgba(217,4,41,0.1)' : 'transparent',
                  borderLeft: `2px solid ${active === id ? 'var(--red)' : 'transparent'}`,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (active !== id) (e.currentTarget as HTMLElement).style.color = 'var(--white)';
                }}
                onMouseLeave={e => {
                  if (active !== id) (e.currentTarget as HTMLElement).style.color = 'var(--muted-light)';
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

/* ─── Section wrapper ─── */
interface PolicySectionProps {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}
function PolicySection({ id, number, title, children }: PolicySectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={`${id}-heading`}
      style={{
        paddingBlock: '3rem',
        borderBottom: '1px solid var(--border)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.22,1,.36,1)',
      }}
    >
      {/* Number + title row */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: '1.5rem' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 11,
          letterSpacing: 3,
          color: 'var(--red)',
          flexShrink: 0,
        }}>{number}</span>
        <h2
          id={`${id}-heading`}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)',
            color: 'var(--white)',
            letterSpacing: -0.5,
            lineHeight: 1.15,
          }}
        >{title}</h2>
      </div>
      <div style={{
        color: 'var(--muted-light)',
        fontSize: 15,
        lineHeight: 1.85,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {children}
      </div>
    </section>
  );
}

/* ─── Highlighted callout ─── */
function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(217,4,41,0.06)',
      border: '1px solid rgba(217,4,41,0.2)',
      borderLeft: '3px solid var(--red)',
      borderRadius: 10,
      padding: '1rem 1.25rem',
      color: 'var(--offwhite)',
      fontSize: 14,
      lineHeight: 1.75,
    }}>
      {children}
    </div>
  );
}

/* ─── Data table ─── */
function DataTable({ rows }: { rows: [string, string][] }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: 'var(--charcoal-3)' }}>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--red)', borderBottom: '1px solid var(--border)' }}>Categoria</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--red)', borderBottom: '1px solid var(--border)' }}>Exemplos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([cat, ex], i) => (
            <tr key={cat} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--charcoal-3)' }}>
              <td style={{ padding: '12px 16px', color: 'var(--offwhite)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, borderBottom: '1px solid var(--border)', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{cat}</td>
              <td style={{ padding: '12px 16px', color: 'var(--muted-light)', fontSize: 13, lineHeight: 1.65, borderBottom: '1px solid var(--border)' }}>{ex}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Rights grid ─── */
function RightCard({ title, desc }: { title: string; desc: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '1.5rem',
        background: hov ? 'var(--charcoal-3)' : 'var(--charcoal-2)',
        border: `1px solid ${hov ? 'rgba(217,4,41,0.3)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        transition: 'all 0.3s cubic-bezier(.22,1,.36,1)',
        transform: hov ? 'translateY(-3px)' : 'none',
      }}
    >
      <div style={{
        width: 32, height: 3,
        background: 'var(--red)',
        borderRadius: 2,
        marginBottom: 14,
        transition: 'width 0.3s ease',
        ...(hov ? { width: 48 } : {}),
      }} />
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--white)', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--muted-light)', lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

/* ─── Page ─── */
export default function PrivacyPage() {
  return (
    <AppLayout
      title="Política de Privacidade"
      description="Saiba como a Tranzor recolhe, utiliza e protege os seus dados pessoais em conformidade com o RGPD."
      canonical="/privacy"
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Política de Privacidade — Tranzor',
        url: 'https://www.Tranzor.pt/privacy',
        description: 'Política de privacidade e proteção de dados da Tranzor, em conformidade com o RGPD.',
        inLanguage: 'pt-PT',
        publisher: {
          '@type': 'Organization',
          name: 'Tranzor',
          url: 'https://www.Tranzor.pt',
        },
        dateModified: '2026-01-01',
      }}
    >

      {/* ═══ HERO ═══ */}
      <section
        role="banner"
        aria-label="Política de Privacidade"
        style={{
          position: 'relative',
          padding: '6rem 2rem 5rem',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Grid bg */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(217,4,41,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(217,4,41,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          zIndex: 0,
        }} />
        {/* Red orb */}
        <div aria-hidden style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(217,4,41,0.08) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <nav aria-label="Localização" style={{ marginBottom: '2rem', animation: 'fadeIn 0.5s ease both' }}>
            <ol style={{ display: 'flex', gap: 8, listStyle: 'none', alignItems: 'center', flexWrap: 'wrap' }}>
              <li>
                <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--muted)', textDecoration: 'none', letterSpacing: 1, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                >Tranzor</Link>
              </li>
              <li aria-hidden style={{ color: 'var(--border)', fontSize: 12 }}>/</li>
              <li><span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--red)', letterSpacing: 1 }}>Privacidade</span></li>
            </ol>
          </nav>

          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(217,4,41,0.08)', border: '1px solid rgba(217,4,41,0.2)',
            borderRadius: 99, padding: '5px 16px', marginBottom: '2rem',
            animation: 'fadeIn 0.6s ease 0.1s both',
          }}>
            <span aria-hidden style={{
              width: 6, height: 6, background: 'var(--red)', borderRadius: '50%',
              display: 'inline-block', animation: 'redPulse 2s ease infinite',
            }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--red)' }}>
              RGPD Conforme — Atualizado Jan 2026
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(2.8rem, 7vw, 6rem)',
            lineHeight: 0.95,
            letterSpacing: -2,
            color: 'var(--white)',
            marginBottom: '1.5rem',
            animation: 'fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.15s both',
          }}>
            Política de<br />
            <span style={{ color: 'var(--red)' }}>Privacidade</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: 'var(--muted-light)',
            maxWidth: 580,
            lineHeight: 1.8,
            animation: 'fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.25s both',
          }}>
            A Tranzor compromete-se a tratar os seus dados pessoais com total
            transparência, segurança e respeito pela legislação vigente —
            nomeadamente o <strong style={{ color: 'var(--offwhite)', fontWeight: 600 }}>Regulamento Geral sobre a Proteção de Dados (RGPD)</strong>.
          </p>

          {/* Meta row */}
          <div style={{
            marginTop: '2.5rem',
            display: 'flex', gap: '2rem', flexWrap: 'wrap',
            animation: 'fadeIn 0.8s ease 0.45s both',
          }}>
            {[
              { label: 'Versão', value: '3.2' },
              { label: 'Vigência', value: '01 Jan 2026' },
              { label: 'Revisão', value: 'Anual' },
              { label: 'Âmbito', value: 'Portugal — UE' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--red)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--offwhite)' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══ BODY ═══ */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '4rem 2rem 8rem',
        display: 'flex',
        gap: '4rem',
        alignItems: 'flex-start',
      }}>

        {/* TOC — hidden on mobile via class */}
        <div className="privacy-toc">
          <TableOfContents />
        </div>

        {/* Content */}
        <article style={{ flex: 1, minWidth: 0 }}>

          <PolicySection id="compromisso" number="01" title="Compromisso Tranzor">
            <p>
              A <strong style={{ color: 'var(--offwhite)' }}>Tranzor — Papelaria Industrial, Lda.</strong>, com sede em São João da Madeira, Portugal, é responsável pelo tratamento dos dados pessoais recolhidos através dos seus canais digitais e físicos.
            </p>
            <p>
              Garantimos que todo o tratamento de dados pessoais é realizado de forma lícita, leal e transparente, sendo os dados recolhidos para finalidades determinadas, explícitas e legítimas, não sendo posteriormente tratados de forma incompatível com essas finalidades.
            </p>
            <Callout>
              Esta Política aplica-se ao website <strong>Tranzor.pt</strong>, à apTranzornzor e a todas as interações presenciais nas nossas megastores. A utilização dos nossos serviços implica a aceitação dos termos aqui descritos.
            </Callout>
          </PolicySection>

          <PolicySection id="recolha" number="02" title="Dados que recolhemos">
            <p>
              Recolhemos apenas os dados estritamente necessários para prestar os nossos serviços. Nunca recolhemos dados sensíveis sem o seu consentimento explícito.
            </p>
            <DataTable rows={[
              ['Identidade', 'Nome completo, número de contribuinte (NIF)'],
              ['Contacto', 'Endereço de email, número de telefone, morada'],
              ['Transacional', 'Histórico de encomendas, faturas, preferências de produto'],
              ['Navegação', 'Endereço IP, cookies de sessão, páginas visitadas'],
              ['Comunicação', 'Mensagens de suporte, reclamações, feedback'],
              ['B2B', 'Denominação social, NIPC, contacto comercial'],
            ]} />
            <p>
              Os dados são recolhidos diretamente — através de formulários, conta cliente ou contacto com suporte — ou de forma automática — via cookies e tecnologias semelhantes, descritos na secção 7.
            </p>
          </PolicySection>

          <PolicySection id="finalidade" number="03" title="Finalidade do tratamento">
            <p>Tratamos os seus dados pessoais exclusivamente para as seguintes finalidades:</p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                'Processamento e gestão de encomendas, entregas e devoluções;',
                'Comunicação relacionada com o estado dos pedidos e suporte pós-venda;',
                'Emissão de faturas e cumprimento de obrigações fiscais e contabilísticas;',
                'Envio de comunicações de marketing, apenas com o seu consentimento expresso;',
                'Personalização da experiência de compra com base no historial de navegação;',
                'Cumprimento de obrigações legais e regulatórias aplicáveis;',
                'Prevenção de fraude e garantia da segurança dos sistemas.',
              ].map(item => (
                <li key={item} style={{
                  paddingLeft: '0.5rem',
                  listStyle: 'none',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <span style={{ color: 'var(--red)', flexShrink: 0, marginTop: 6, display: 'block', width: 4, height: 4, borderRadius: '50%', background: 'var(--red)' }} />
                  {item}
                </li>
              ))}
            </ul>
            <Callout>
              <strong>Base legal:</strong> O tratamento é fundamentado no contrato (execução de encomenda), na obrigação legal (faturação), no interesse legítimo (segurança e prevenção de fraude) ou no consentimento explícito (marketing). Pode revogar o consentimento em qualquer momento.
            </Callout>
          </PolicySection>

          <PolicySection id="partilha" number="04" title="Partilha de dados">
            <p>
              A Tranzor <strong style={{ color: 'var(--offwhite)' }}>não vende, aluga nem comercializa</strong> os seus dados pessoais a terceiros. Partilhamos informação apenas nas seguintes circunstâncias:
            </p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { title: 'Parceiros logísticos', desc: 'CTT, DPD e transportadoras — para cumprimento da entrega.' },
                { title: 'Processadores de pagamento', desc: 'Stripe, MB Way — para processamento seguro de transações.' },
                { title: 'Plataformas de análise', desc: 'Google Analytics — para métricas de desempenho anonimizadas.' },
                { title: 'Obrigações legais', desc: 'Autoridades fiscais e judiciais, quando legalmente exigido.' },
              ].map(({ title, desc }) => (
                <li key={title} style={{ listStyle: 'none', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--red)', flexShrink: 0, marginTop: 6, display: 'block', width: 4, height: 4, borderRadius: '50%', background: 'var(--red)' }} />
                  <span><strong style={{ color: 'var(--offwhite)', fontWeight: 600 }}>{title}:</strong> {desc}</span>
                </li>
              ))}
            </ul>
            <p>
              Todos os subcontratantes estão contratualmente obrigados a tratar os dados com o mesmo nível de proteção garantido pela Tranzor.
            </p>
          </PolicySection>

          <PolicySection id="retencao" number="05" title="Retenção de dados">
            <p>
              Os dados são conservados apenas pelo período necessário às finalidades para que foram recolhidos ou conforme exigido por lei:
            </p>
            <DataTable rows={[
              ['Dados de conta', '5 anos após encerramento da conta'],
              ['Documentos fiscais', '10 anos (obrigação legal — CIVA)'],
              ['Histórico de encomendas', '7 anos após a última compra'],
              ['Dados de navegação', '13 meses (Google Analytics)'],
              ['Comunicações de suporte', '3 anos após resolução'],
              ['Consentimento marketing', 'Até revogação pelo titular'],
            ]} />
            <p>
              Findo o prazo de retenção, os dados são eliminados de forma segura ou anonimizados para fins estatísticos.
            </p>
          </PolicySection>

          <PolicySection id="direitos" number="06" title="Os seus direitos">
            <p>
              Ao abrigo do RGPD, tem os seguintes direitos sobre os seus dados pessoais. Para os exercer, contacte o nosso DPO através dos dados indicados na secção 8.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginTop: '0.5rem',
            }} className="rights-grid">
              <RightCard
                title="Direito de Acesso"
                desc="Obter confirmação sobre se os seus dados são tratados e aceder a uma cópia dos mesmos."
              />
              <RightCard
                title="Direito de Retificação"
                desc="Solicitar a correção de dados inexatos ou incompletos sem demora injustificada."
              />
              <RightCard
                title="Direito ao Apagamento"
                desc="Solicitar a eliminação dos seus dados quando estes já não sejam necessários às finalidades."
              />
              <RightCard
                title="Direito à Portabilidade"
                desc="Receber os seus dados num formato estruturado e legível por máquina, para transferência."
              />
              <RightCard
                title="Direito de Oposição"
                desc="Opor-se ao tratamento baseado em interesse legítimo ou para fins de marketing direto."
              />
              <RightCard
                title="Direito de Limitação"
                desc="Solicitar a suspensão do tratamento enquanto uma contestação ou reclamação esteja pendente."
              />
            </div>
            <Callout>
              Tem ainda o direito de apresentar reclamação à <strong>Comissão Nacional de Proteção de Dados (CNPD)</strong> — autoridade de controlo portuguesa — em <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', textDecoration: 'none', fontWeight: 600 }}>cnpd.pt</a>.
            </Callout>
          </PolicySection>

          <PolicySection id="cookies" number="07" title="Cookies e rastreamento">
            <p>
              O website Tranzor.pt utiliza cookies para garantir o correto funcionamento da plataforma, medir o desempenho e personalizar a sua experiência. Pode gerir as suas preferências a qualquer momento.
            </p>
            <DataTable rows={[
              ['Estritamente necessários', 'Sessão, autenticação, carrinho de compras — não requerem consentimento'],
              ['Analíticos', 'Google Analytics — tráfego e comportamento de navegação anonimizados'],
              ['Funcionais', 'Preferências de idioma, região e visualização'],
              ['Marketing', 'Google Ads, Meta Pixel — apenas com consentimento expresso'],
            ]} />
            <p>
              Pode retirar ou alterar o seu consentimento em qualquer momento através do painel de gestão de cookies disponível no rodapé do website, ou configurando o seu browser para recusar cookies. Note que a recusa de cookies essenciais pode comprometer o funcionamento da plataforma.
            </p>
          </PolicySection>

          <PolicySection id="contacto" number="08" title="Contacto — Encarregado de Proteção de Dados">
            <p>
              Para exercer os seus direitos ou colocar qualquer questão relativa ao tratamento dos seus dados pessoais, contacte o nosso Encarregado de Proteção de Dados (DPO):
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginTop: '0.5rem',
            }} className="contact-grid">
              {[
                { label: 'Email', value: 'dpo@Tranzor.pt' },
                { label: 'Telefone', value: '+351 256 880 390' },
                { label: 'Morada', value: 'R. Bartolomeu Dias, 3700-057 S. J. da Madeira' },
                { label: 'Prazo de resposta', value: 'Até 30 dias úteis (RGPD, art. 12.º)' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  padding: '1.25rem 1.5rem',
                  background: 'var(--charcoal-3)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--red)', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--offwhite)' }}>{value}</div>
                </div>
              ))}
            </div>
            <p>
              Em caso de resposta insatisfatória, pode apresentar reclamação junto da CNPD em{' '}
              <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', textDecoration: 'none', fontWeight: 600 }}>cnpd.pt</a>.
            </p>
          </PolicySection>

          {/* Back CTA */}
          <div style={{ paddingTop: '3rem', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: 'var(--offwhite)',
              padding: '10px 22px', borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
              letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'none',
              border: '1px solid var(--border)',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(217,4,41,0.4)'; el.style.background = 'rgba(217,4,41,0.06)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.background = 'transparent'; }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Voltar ao inicio
            </Link>
            <Link to="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--red)', color: 'white',
              padding: '10px 22px', borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
              letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'none',
              boxShadow: 'var(--shadow-red)',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--red-vivid)'; el.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--red)'; el.style.transform = 'none'; }}
            >
              Contactar DPO
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </article>
      </div>

      <style>{`
        .privacy-toc {
          display: block;
          width: 240px;
          flex-shrink: 0;
        }
        @media (max-width: 1024px) {
          .privacy-toc { display: none !important; }
        }
        @media (max-width: 640px) {
          .rights-grid  { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AppLayout>
  );
}