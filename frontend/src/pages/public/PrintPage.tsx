import React, { useRef, useEffect, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

/* ═══════════════════════════════════════
   DADOS
═══════════════════════════════════════ */
const SERVICES = [
  {
    id: 'copias',
    title: 'Cópias',
    sub: 'Preto & Branco e Cor',
    desc: 'Documentos, livros, revistas e processos. Formatos A5 ao A3. Papel de 75 a 160 g/m².',
    items: ['A4 P&B a partir de 0,05 €', 'A4 Cor a partir de 0,25 €', 'A3 disponível', 'Frente e verso'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    ),
  },
  {
    id: 'impressao',
    title: 'Impressão',
    sub: 'Documentos & Fotografias',
    desc: 'Traga o seu ficheiro em pen ou envie por email. Impressão de alta qualidade, fotografias e documentos técnicos.',
    items: ['PDF, Word, PowerPoint', 'Fotografias 10×15 a A3', 'Alta resolução', 'Entrega rápida'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
    ),
  },
  {
    id: 'encadernacao',
    title: 'Encadernação',
    sub: 'Espiral, Térmica e Capa Dura',
    desc: 'Trabalhos académicos, relatórios e dossiers com acabamento profissional.',
    items: ['Espiral plástica e metálica', 'Encadernação térmica', 'Capa transparente ou cor', 'Capa dura sob encomenda'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    id: 'plastificacao',
    title: 'Plastificação',
    sub: 'Brilhante e Mate',
    desc: 'Proteja os seus documentos, cartões, menus e certificados. Acabamento brilhante ou mate.',
    items: ['A7 ao A3', 'Brilhante e mate', 'Espessura 80 a 250 microns', 'Entrega imediata'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    id: 'carimbos',
    title: 'Carimbos',
    sub: 'Personalizados',
    desc: 'Carimbos de borracha ou automáticos com o seu logótipo, assinatura ou texto. Produção em 24–48h.',
    items: ['Carimbo de bolso', 'Carimbo automático', 'Tinta incluída', 'Várias cores disponíveis'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16H3l2-7h14l2 7z" />
        <rect x="9" y="16" width="6" height="4" />
        <path d="M10 9V5a2 2 0 1 1 4 0v4" />
      </svg>
    ),
  },
  {
    id: 'digitalizacao',
    title: 'Digitalização',
    sub: 'Documentos & Fotos Antigas',
    desc: 'Converta documentos físicos, fotografias e negativos em ficheiros digitais de alta resolução.',
    items: ['Digitalização até A3', 'Resolução até 1200 dpi', 'PDF, JPG ou TIFF', 'Fotos antigas e negativos'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: 'cartoes',
    title: 'Cartões & Folhetos',
    sub: 'Impressão Offset e Digital',
    desc: 'Cartões de visita, folhetos, flyers e brochuras. Traga o seu ficheiro ou peça ajuda à nossa equipa.',
    items: ['Cartões de visita', 'Flyers A5 e A4', 'Brochuras dobradas', 'Papel premium disponível'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
  {
    id: 'outras',
    title: 'Outros Serviços',
    sub: 'Pergunte-nos',
    desc: 'Banners, lonas, autocolantes, convites de casamento, calendários personalizados e muito mais.',
    items: ['Banners e lonas', 'Autocolantes', 'Convites personalizados', 'Calendários'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

const STEPS = [
  { n: '01', title: 'Prepare o ficheiro', desc: 'PDF, Word, JPG ou PowerPoint. Pode trazer em pen USB ou enviar por email para a loja.' },
  { n: '02', title: 'Dirija-se à loja', desc: 'Qualquer uma das nossas lojas tem o equipamento necessário para tratar do seu pedido.' },
  { n: '03', title: 'Escolha o serviço', desc: 'A nossa equipa ajuda-o a escolher o formato, papel e acabamento certo para a sua necessidade.' },
  { n: '04', title: 'Levante na hora', desc: 'A maioria dos serviços fica pronta enquanto espera. Carimbos e trabalhos complexos em 24–48h.' },
];

const LOJAS = [
  { nome: 'Tranzor São João da Madeira', morada: 'R. Bartolomeu Dias, 3700-057 SJM', horario: 'Seg–Sex 9h–20h · Sáb–Dom 10h–19h', tel: '+351 256 880 390' },
  { nome: 'Tranzor Porto',               morada: 'Centro Empresarial da Circunvalação, Porto', horario: 'Seg–Sex 9h–20h · Sáb–Dom 10h–19h', tel: '+351 222 000 000' },
];

/* ═══════════════════════════════════════
   ÍCONES UTILITÁRIOS
═══════════════════════════════════════ */
const IcoCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcoMap = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IcoPhone = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.53 2 2 0 0 1 3.6 1.37h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.72-1.72a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IcoClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/* ═══════════════════════════════════════
   HOOK: intersection observer
═══════════════════════════════════════ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ═══════════════════════════════════════
   CARD DE SERVIÇO
═══════════════════════════════════════ */
function ServiceCard({ s, delay }: { s: typeof SERVICES[0]; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        background: '#fff',
        border: '1px solid #eedada',
        borderRadius: 4,
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '.75rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity .45s ease ${delay}ms, transform .45s ease ${delay}ms`,
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 4,
        background: 'linear-gradient(145deg,#c81c1c,#7f1d1d)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', flexShrink: 0,
      }}>
        {s.icon}
      </div>

      <div>
        <div style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 700, fontSize: '1.08rem',
          color: '#160202', letterSpacing: '-.01em',
          lineHeight: 1.2, marginBottom: '.2rem',
        }}>{s.title}</div>
        <div style={{
          fontSize: '.74rem', fontWeight: 600,
          color: '#c81c1c', letterSpacing: '.07em',
          textTransform: 'uppercase',
        }}>{s.sub}</div>
      </div>

      <p style={{
        fontSize: '.84rem', lineHeight: 1.65,
        color: '#5a2020', margin: 0, opacity: .75,
      }}>{s.desc}</p>

      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
        {s.items.map((item, i) => (
          <li key={i} style={{
            display: 'flex', alignItems: 'center', gap: '.45rem',
            fontSize: '.81rem', color: '#5a2020',
          }}>
            <span style={{ color: '#c81c1c', flexShrink: 0 }}><IcoCheck /></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════ */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #eedada', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem', width: '100%', padding: '1rem 0',
          background: 'transparent', border: 'none', cursor: 'pointer',
          textAlign: 'left', fontFamily: 'inherit',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '.9rem', color: '#160202', lineHeight: 1.4 }}>{q}</span>
        <span style={{
          flexShrink: 0, width: 20, height: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#c81c1c',
          transition: 'transform .25s',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <div style={{ maxHeight: open ? '200px' : '0', overflow: 'hidden', transition: 'max-height .3s ease' }}>
        <p style={{ margin: '0 0 1.1rem', fontSize: '.85rem', lineHeight: 1.7, color: '#7a3030', opacity: .8 }}>{a}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PÁGINA PRINCIPAL
═══════════════════════════════════════ */
export default function PrintPage() {
  const { ref: stepsRef, visible: stepsVisible } = useReveal();
  const { ref: lojasRef, visible: lojasVisible } = useReveal();

  return (
    <AppLayout
      title="Centro de Cópias & Impressão — Tranzor"
      description="Cópias, encadernação, plastificação, carimbos, digitalização e muito mais. Disponível nas lojas Tranzor em São João da Madeira e Porto."
      canonical="/shop/impressao"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=Instrument+Sans:wght@400;500;600&display=swap');

        .imp * { font-family:'Instrument Sans', system-ui, sans-serif; box-sizing:border-box; }

        @keyframes imp-up   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes imp-fade { from{opacity:0} to{opacity:1} }

        .imp-hero-title span { display:inline-block; animation: imp-up .7s ease both; }
        .imp-hero-title span:nth-child(1){animation-delay:.05s}
        .imp-hero-title span:nth-child(2){animation-delay:.15s}
        .imp-hero-title span:nth-child(3){animation-delay:.25s}

        .imp-tag  { animation: imp-fade .6s ease .4s both; }
        .imp-lead { animation: imp-up .6s ease .35s both; }
        .imp-cta  { animation: imp-up .6s ease .5s both; }

        .imp-btn-primary {
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.75rem 1.75rem; border-radius:3px;
          background:linear-gradient(135deg,#c81c1c,#8b0f0f);
          color:#fff; font-size:.88rem; font-weight:600;
          border:none; cursor:pointer; font-family:inherit;
          text-decoration:none; letter-spacing:.01em;
          box-shadow:0 4px 16px rgba(160,10,10,.25);
          transition:box-shadow .2s, transform .2s;
        }
        .imp-btn-primary:hover { box-shadow:0 6px 22px rgba(160,10,10,.4); transform:translateY(-1px); }

        /* Ghost button — agora com borda escura sobre fundo branco */
        .imp-btn-ghost {
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.73rem 1.5rem; border-radius:3px;
          background:transparent; color:#5a2020; font-size:.88rem; font-weight:500;
          border:1px solid rgba(90,32,32,.3); cursor:pointer; font-family:inherit;
          text-decoration:none; letter-spacing:.01em;
          transition:background .2s, border-color .2s, color .2s;
        }
        .imp-btn-ghost:hover { background:rgba(200,28,28,.06); border-color:rgba(200,28,28,.5); color:#c81c1c; }

        .imp-step { opacity:0; transform:translateY(16px); transition:opacity .4s ease, transform .4s ease; }
        .imp-step.vis { opacity:1; transform:translateY(0); }

        .imp-loja { opacity:0; transform:translateX(-12px); transition:opacity .4s ease, transform .4s ease; }
        .imp-loja.vis { opacity:1; transform:translateX(0); }

        /* Note rows — fundo claro sobre hero branco */
        .imp-note-row {
          display:flex; align-items:flex-start; gap:.6rem;
          padding:.7rem 1rem;
          background:rgba(200,28,28,.05);
          border:1px solid rgba(200,28,28,.15);
          border-radius:3px;
          font-size:.82rem; color:rgba(90,32,32,.8); line-height:1.55;
        }
        .imp-note-row svg { flex-shrink:0; margin-top:1px; opacity:.65; }

        @media (max-width:600px) {
          .imp-services-grid { grid-template-columns:1fr !important; }
          .imp-steps-grid    { grid-template-columns:1fr !important; }
          .imp-lojas-grid    { grid-template-columns:1fr !important; }
          .imp-hero-inner    { padding:3rem 1.25rem 2.5rem !important; }
          .imp-section       { padding:3rem 1.25rem !important; }
        }
      `}</style>

      <div className="imp">

        {/* ══════════════════════════════════
            HERO — fundo branco
        ══════════════════════════════════ */}
        <section style={{
          background: '#ffffff',
          position: 'relative', overflow: 'hidden',
          borderBottom: '3px solid #c81c1c',
        }}>
          {/* Grade decorativa — tom muito subtil sobre branco */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `
              repeating-linear-gradient(0deg,   rgba(200,28,28,.04) 0,rgba(200,28,28,.04) 1px,transparent 1px,transparent 64px),
              repeating-linear-gradient(90deg,  rgba(200,28,28,.04) 0,rgba(200,28,28,.04) 1px,transparent 1px,transparent 64px)`,
          }} />

          {/* Acento vermelho suave no canto direito */}
          <div style={{
            position: 'absolute', right: 0, top: 0, width: '45%', height: '100%',
            background: 'radial-gradient(ellipse at 90% 30%, rgba(200,28,28,.07) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          {/* Texto decorativo de fundo — vermelho muito suave sobre branco */}
          <div style={{
            position: 'absolute', bottom: -20, left: -10,
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(7rem,20vw,18rem)',
            fontWeight: 900, letterSpacing: '-.04em',
            color: 'rgba(255, 0, 0, 0.07)',
            lineHeight: 1, pointerEvents: 'none',
            userSelect: 'none', whiteSpace: 'nowrap',
          }}>IMPRESSÃO</div>

          <div className="imp-hero-inner" style={{ maxWidth: 820, margin: '0 auto', padding: '5rem 1.5rem 4.5rem', position: 'relative' }}>

            {/* Tag */}
            <div className="imp-tag" style={{
              display: 'inline-flex', alignItems: 'center', gap: '.5rem',
              border: '1px solid rgba(200,28,28,.4)',
              borderRadius: 3, padding: '4px 12px', marginBottom: '1.5rem',
              background: 'rgba(200,28,28,.04)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c81c1c', display: 'inline-block' }} />
              <span style={{
                fontSize: '.7rem', fontWeight: 600, letterSpacing: '.1em',
                textTransform: 'uppercase', color: '#7a2020',
              }}>Disponível nas lojas físicas · SJM e Porto</span>
            </div>

            {/* Título — textos principais agora escuros/vermelhos */}
            <h1 className="imp-hero-title" style={{
              fontFamily: "'Fraunces', serif",
              color: '#160202', margin: '0 0 1.5rem',
              fontSize: 'clamp(2.5rem,6.5vw,4.5rem)',
              fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1.0,
            }}>
              <span>Centro de</span>{' '}
              <span style={{ color: '#c81c1c', fontStyle: 'italic' }}>Cópias</span>{' '}
              <span>& <span style={{ color: '#c81c1c', fontStyle: 'italic' }}>Impressão</span></span>
            </h1>

            {/* Lead — escuro sobre branco */}
            <p className="imp-lead" style={{
              color: 'rgba(22,2,2,.55)', margin: '0 0 2.25rem',
              fontSize: 'clamp(.95rem,2vw,1.1rem)',
              lineHeight: 1.7, maxWidth: 520, fontWeight: 300,
            }}>
              Cópias, encadernação, plastificação, carimbos, digitalização e muito mais.
              Trazemos a imprensa profissional ao alcance de todos.
            </p>

            {/* CTAs */}
            <div className="imp-cta" style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', alignItems: 'center' }}>
              <a href="#servicos" className="imp-btn-primary">
                Ver todos os serviços
              </a>
              <a href="#lojas" className="imp-btn-ghost">
                Encontrar uma loja
              </a>
            </div>

            {/* Notas */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem', marginTop: '2.5rem' }}>
              <div className="imp-note-row" style={{ flex: '1 1 220px' }}>
                <span style={{ color: '#c81c1c' }}><IcoClock /></span>
                Maioria dos serviços prontos enquanto espera
              </div>
              <div className="imp-note-row" style={{ flex: '1 1 220px', flexWrap: 'nowrap', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                <span style={{ color: '#c81c1c', flexShrink: 0 }}><IcoMap /></span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Envie para{' '}
                  <a
                    href="mailto:centrocopias@Tranzor.com"
                    style={{ color: '#c81c1c', textDecoration: 'none', fontWeight: 700, borderBottom: '1px solid rgba(200,28,28,0.35)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderBottomColor = '#c81c1c')}
                    onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'rgba(200,28,28,0.35)')}
                  >
                    centrocopias@Tranzor.com
                  </a>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            SERVICOS
        ══════════════════════════════════ */}
        <section id="servicos" className="imp-section" style={{
          background: '#ffffff', padding: '4.5rem 1.5rem',
          borderTop: '3px solid #c81c1c',
        }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{
                fontSize: '.7rem', fontWeight: 600, letterSpacing: '.12em',
                textTransform: 'uppercase', color: '#c81c1c', marginBottom: '.6rem',
              }}>O que oferecemos</div>
              <h2 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(1.7rem,3.5vw,2.4rem)',
                fontWeight: 900, color: '#160202',
                margin: 0, letterSpacing: '-.02em', lineHeight: 1.1,
              }}>Todos os serviços<br /><em style={{ fontWeight: 400, color: '#c81c1c' }}>numa só loja.</em></h2>
            </div>

            <div className="imp-services-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
              gap: '1rem',
            }}>
              {SERVICES.map((s, i) => (
                <ServiceCard key={s.id} s={s} delay={i * 55} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            COMO FUNCIONA
        ══════════════════════════════════ */}
        <section className="imp-section" style={{
          background: '#fff', padding: '4.5rem 1.5rem',
          borderTop: '1px solid #eedada', borderBottom: '1px solid #eedada',
        }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{
                fontSize: '.7rem', fontWeight: 600, letterSpacing: '.12em',
                textTransform: 'uppercase', color: '#c81c1c', marginBottom: '.6rem',
              }}>Processo simples</div>
              <h2 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(1.7rem,3.5vw,2.4rem)',
                fontWeight: 900, color: '#160202',
                margin: 0, letterSpacing: '-.02em', lineHeight: 1.1,
              }}>Como funciona?</h2>
            </div>

            <div ref={stepsRef} className="imp-steps-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
              gap: '1px', background: '#eedada',
              border: '1px solid #eedada', borderRadius: 4, overflow: 'hidden',
            }}>
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`imp-step${stepsVisible ? ' vis' : ''}`}
                  style={{ background: '#fff', padding: '1.75rem 1.5rem', transitionDelay: `${i * 100}ms` }}
                >
                  <div style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: '2.2rem', fontWeight: 900,
                    color: '#f0d8d8', lineHeight: 1, marginBottom: '1rem',
                    letterSpacing: '-.03em',
                  }}>{step.n}</div>
                  <div style={{ fontWeight: 600, fontSize: '.92rem', color: '#160202', marginBottom: '.5rem', letterSpacing: '-.01em' }}>{step.title}</div>
                  <p style={{ fontSize: '.82rem', lineHeight: 1.65, color: '#7a3030', margin: 0, opacity: .75 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            BANNER — orçamento
        ══════════════════════════════════ */}
        <section style={{
          background: 'linear-gradient(135deg,#c81c1c 0%,#7f1d1d 100%)',
          padding: '3.5rem 1.5rem', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `repeating-linear-gradient(45deg,rgba(255,255,255,.03) 0,rgba(255,255,255,.03) 1px,transparent 1px,transparent 32px)`,
          }} />
          <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative' }}>
            <div style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(1.4rem,3vw,2rem)',
              fontWeight: 700, color: '#fff',
              marginBottom: '.75rem', letterSpacing: '-.02em', lineHeight: 1.2,
            }}>
              Precisa de orçamento para<br />
              <em style={{ fontWeight: 400 }}>uma tiragem maior?</em>
            </div>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '.9rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
              Para empresas, associações e serviços públicos, apresentamos propostas
              personalizadas com preços especiais para volumes elevados.
            </p>
            <a href="/contact" className="imp-btn-primary" style={{
              background: '#fff', color: '#8b0f0f',
              boxShadow: '0 4px 16px rgba(0,0,0,.2)',
            }}>
              Pedir orçamento
            </a>
          </div>
        </section>

        {/* ══════════════════════════════════
            LOJAS
        ══════════════════════════════════ */}
        <section id="lojas" className="imp-section" style={{
          background: '#0a0101', padding: '4.5rem 1.5rem',
        }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{
                fontSize: '.7rem', fontWeight: 600, letterSpacing: '.12em',
                textTransform: 'uppercase', color: '#c81c1c', marginBottom: '.6rem',
              }}>Onde estamos</div>
              <h2 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(1.7rem,3.5vw,2.4rem)',
                fontWeight: 900, color: '#fff',
                margin: 0, letterSpacing: '-.02em', lineHeight: 1.1,
              }}>Encontre a loja<br />
                <em style={{ fontWeight: 400, color: '#f47070' }}>mais próxima.</em>
              </h2>
            </div>

            <div ref={lojasRef} className="imp-lojas-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: '1rem',
            }}>
              {LOJAS.map((loja, i) => (
                <div
                  key={i}
                  className={`imp-loja${lojasVisible ? ' vis' : ''}`}
                  style={{
                    background: 'rgba(255,255,255,.04)',
                    border: '1px solid rgba(255,255,255,.08)',
                    borderRadius: 4, padding: '1.4rem',
                    transitionDelay: `${i * 100}ms`,
                  }}
                >
                  <div style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 700, fontSize: '1rem',
                    color: '#fff', marginBottom: '.75rem', letterSpacing: '-.01em',
                  }}>{loja.nome}</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                    {[
                      { ico: <IcoMap />,   text: loja.morada  },
                      { ico: <IcoClock />, text: loja.horario },
                      { ico: <IcoPhone />, text: loja.tel     },
                    ].map((row, j) => (
                      <div key={j} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '.5rem',
                        fontSize: '.81rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.5,
                      }}>
                        <span style={{ color: '#f47070', flexShrink: 0, marginTop: 1 }}>{row.ico}</span>
                        {row.text}
                      </div>
                    ))}
                  </div>

                  <a href="/contact"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '.35rem',
                      marginTop: '1.1rem', padding: '5px 13px', borderRadius: 3,
                      border: '1px solid rgba(200,28,28,.4)',
                      background: 'transparent', color: '#f47070',
                      fontSize: '.76rem', fontWeight: 500, textDecoration: 'none',
                      fontFamily: 'inherit', cursor: 'pointer',
                      transition: 'background .15s, border-color .15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(200,28,28,.12)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,28,28,.7)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,28,28,.4)';
                    }}
                  >
                    Contactar esta loja
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            FAQ
        ══════════════════════════════════ */}
        <section className="imp-section" style={{
          background: '#f5f0f0', padding: '4rem 1.5rem',
          borderTop: '1px solid #eedada',
        }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(1.4rem,3vw,1.9rem)',
              fontWeight: 700, color: '#160202',
              letterSpacing: '-.02em', marginBottom: '2rem',
            }}>Perguntas frequentes</div>

            {[
              {
                q: 'Posso enviar o ficheiro por email antes de ir à loja?',
                a: 'Sim. Envie o ficheiro para centrocopias@Tranzor.com com o assunto "Pedido de impressão" e confirme com a equipa os detalhes.',
              },
              {
                q: 'Qual o prazo para os carimbos personalizados?',
                a: 'O prazo habitual é 24 a 48 horas úteis. Para carimbos simples de borracha, pode ser possível na hora, dependendo da disponibilidade.',
              },
              {
                q: 'Aceitam ficheiros em qualquer formato?',
                a: 'Recomendamos PDF para garantir o resultado final. Também aceitamos Word, PowerPoint, JPEG e PNG. Para trabalhos de design, entregue sempre em PDF com fontes incorporadas.',
              },
              {
                q: 'Fazem impressão de lonas e banners de grande formato?',
                a: 'Sim, mediante encomenda prévia. Contacte a loja mais próxima para obter um orçamento específico para o seu projeto.',
              },
              {
                q: 'Têm serviço para empresas com volumes elevados?',
                a: 'Sim. Para empresas, escolas e instituições com necessidades regulares, disponibilizamos preços especiais e condições personalizadas. Contacte-nos para um orçamento.',
              },
            ].map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

      </div>
    </AppLayout>
  );
}