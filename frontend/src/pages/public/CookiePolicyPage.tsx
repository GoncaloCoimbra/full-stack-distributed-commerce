import React from 'react';
import AppLayout from '../../layouts/AppLayout';

/* ─────────────────────────────────────────
   COOKIE SECTION
   ───────────────────────────────────────── */
function CookieSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: 'var(--radius-lg)',
      padding: '2rem 2.5rem',
      marginBottom: '1.25rem',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 18,
        color: '#111111',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <span style={{
          width: 4,
          height: 20,
          background: 'var(--red)',
          borderRadius: 2,
          display: 'inline-block',
          flexShrink: 0,
        }} />
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   COOKIE TYPE CARD
   ───────────────────────────────────────── */
function CookieTypeCard({ name, purpose, duration, required }: {
  name: string; purpose: string; duration: string; required: boolean;
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '1rem',
      padding: '1.25rem 0',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 14,
            color: '#111111',
          }}>{name}</span>
          {required && (
            <span style={{
              background: 'rgba(217,4,41,0.08)',
              border: '1px solid rgba(217,4,41,0.25)',
              color: 'var(--red)',
              fontSize: 10,
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              letterSpacing: 1,
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: 99,
            }}>Essencial</span>
          )}
        </div>
        <p style={{ fontSize: 13, color: '#555555', lineHeight: 1.6, margin: 0 }}>{purpose}</p>
      </div>
      <div style={{
        fontSize: 12,
        color: '#999999',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        alignSelf: 'start',
        paddingTop: 2,
      }}>{duration}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PÁGINA PRINCIPAL
   ───────────────────────────────────────── */
export default function CookiePolicyPage() {
  return (
    <AppLayout
      title="Política de Cookies — Tranzor"
      description="Saiba como a Tranzor utiliza cookies para melhorar a sua experiência, análises e desempenho no site."
      canonical="/cookies"
    >
      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        padding: '8rem 2rem 5rem',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        background: '#ffffff',
      }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(217,4,41,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(217,4,41,0.04) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        <div aria-hidden style={{
          position: 'absolute', top: '20%', right: '-10%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(217,4,41,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <span style={{
            display: 'inline-block',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'var(--red)',
            marginBottom: '1.25rem',
          }}>— Privacidade & Transparência</span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            lineHeight: 1.1,
            color: '#111111',
            letterSpacing: -0.5,
            marginBottom: '1.5rem',
          }}>
            Política de{' '}
            <span style={{ color: 'var(--red)' }}>Cookies</span>
          </h1>
          <p style={{
            fontSize: 17,
            color: '#555555',
            lineHeight: 1.8,
            maxWidth: 580,
            marginBottom: '2rem',
          }}>
            Utilizamos cookies para garantir o funcionamento do site, melhorar a sua experiência
            e compreender como os nossos serviços são utilizados. Aqui explicamos tudo com transparência.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 12,
            color: '#999999',
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
            </svg>
            Última atualização: Janeiro 2025
          </div>
        </div>
      </section>

      {/* ── CONTEÚDO ── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 2rem 6rem' }}>

        <CookieSection title="O que são cookies?">
          <p style={{ fontSize: 14, color: '#555555', lineHeight: 1.8, margin: 0 }}>
            Cookies são pequenos ficheiros de texto guardados no seu dispositivo quando visita o nosso site.
            Permitem-nos reconhecer o seu browser, guardar preferências e oferecer uma experiência mais
            personalizada e eficiente. Alguns cookies são essenciais para o funcionamento do site — sem eles,
            certas funcionalidades não estariam disponíveis.
          </p>
        </CookieSection>

        <CookieSection title="Tipos de cookies que utilizamos">
          <div>
            <CookieTypeCard
              name="Cookies Essenciais"
              purpose="Necessários para o funcionamento básico do site: sessão de utilizador, carrinho de compras, preferências de idioma e segurança."
              duration="Sessão / 1 ano"
              required={true}
            />
            <CookieTypeCard
              name="Cookies Analíticos"
              purpose="Ajudam-nos a compreender como os visitantes interagem com o site, quais as páginas mais visitadas e onde ocorrem erros."
              duration="2 anos"
              required={false}
            />
            <CookieTypeCard
              name="Cookies de Preferências"
              purpose="Guardam as suas escolhas de visualização, como tema, região e preferências de comunicação para visitas futuras."
              duration="1 ano"
              required={false}
            />
            <CookieTypeCard
              name="Cookies de Desempenho"
              purpose="Medem o tempo de carregamento das páginas e identificam oportunidades de melhoria na velocidade do site."
              duration="6 meses"
              required={false}
            />
          </div>
        </CookieSection>

        <CookieSection title="Como gerir os seus cookies">
          <p style={{ fontSize: 14, color: '#555555', lineHeight: 1.8, marginBottom: '1rem' }}>
            Tem controlo total sobre os cookies não essenciais. Pode ajustar as suas preferências a qualquer momento
            através das definições do seu browser ou das ferramentas de gestão de privacidade disponíveis no site.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { browser: 'Google Chrome', path: 'Definições → Privacidade e segurança → Cookies' },
              { browser: 'Mozilla Firefox', path: 'Opções → Privacidade e Segurança → Cookies' },
              { browser: 'Safari', path: 'Preferências → Privacidade → Gerir dados do site' },
              { browser: 'Microsoft Edge', path: 'Definições → Privacidade, pesquisa e serviços → Cookies' },
            ].map(({ browser, path }) => (
              <div key={browser} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '0.75rem 1rem',
                background: 'rgba(217,4,41,0.03)',
                border: '1px solid rgba(217,4,41,0.1)',
                borderRadius: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" aria-hidden>
                  <path d="M9 18l6-6-6-6"/>
                </svg>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: '#111111', minWidth: 140 }}>{browser}</span>
                <span style={{ fontSize: 12, color: '#555555' }}>{path}</span>
              </div>
            ))}
          </div>
        </CookieSection>

        <CookieSection title="Cookies de terceiros">
          <p style={{ fontSize: 14, color: '#555555', lineHeight: 1.8, margin: 0 }}>
            Alguns serviços integrados no nosso site, como ferramentas de análise e pagamento, podem definir
            os seus próprios cookies. Estes são regidos pelas políticas de privacidade dos respetivos fornecedores
            e estão fora do nosso controlo direto. Recomendamos que consulte as políticas de cada serviço.
          </p>
        </CookieSection>

        {/* CTA */}
        <div style={{
          marginTop: '3rem',
          padding: '2.5rem',
          background: 'var(--red)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div aria-hidden style={{
            position: 'absolute', right: -40, top: -40,
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }} />
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 18,
              color: 'white',
              margin: '0 0 6px',
            }}>Dúvidas sobre privacidade?</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.6 }}>
              A nossa equipa está disponível para esclarecer qualquer questão.
            </p>
          </div>
          <a href="/contact" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'white',
            color: 'var(--red)',
            textDecoration: 'none',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: 1,
            textTransform: 'uppercase',
            padding: '12px 24px',
            borderRadius: 8,
            flexShrink: 0,
            transition: 'transform 0.2s',
          }}>
            Contactar
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="var(--red)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>
    </AppLayout>
  );
}