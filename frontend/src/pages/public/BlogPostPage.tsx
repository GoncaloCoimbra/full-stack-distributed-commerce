import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';

const articles: Record<string, { title: string; description: string; highlights: string[]; summary: string }> = {
  'tendencias-2026': {
    title: 'Tendências 2026',
    description: 'Uma análise clara aos principais desafios de gestão, com recomendações para indústria, comércio e equipas de suporte.',
    summary: 'Este artigo descreve as áreas críticas para modernizar operações e ganhar vantagem competitiva no mercado português.',
    highlights: ['Estratégia para automação industrial.', 'Melhoria da experiência de cliente no retalho.', 'Atendimento pós-venda e suporte eficiente.']
  },
  'tecnologia-industrial': {
    title: 'Tecnologia industrial',
    description: 'Descubra como a automação e a análise de dados podem transformar a sua cadeia de valor.',
    summary: 'Conheça práticas de integração tecnológica que aumentam eficiência e reduzem custos operacionais.',
    highlights: ['Operações conectadas e inteligentes.', 'Infraestrutura orientada a dados.', 'Monitorização e controlo em tempo real.']
  },
  'experiencia-retalho': {
    title: 'Experiência de retalho',
    description: 'Melhore a experiência do cliente com soluções adaptadas ao comércio contemporâneo.',
    summary: 'Estratégias para oferecer um serviço premium, fidelizar clientes e otimizar conversões em loja e online.',
    highlights: ['Design de espaços memoráveis.', 'Atendimento omnicanal eficiente.', 'Promoções e ofertas de valor percebido.']
  }
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug || !articles[slug]) {
    return <Navigate to="/404" replace />;
  }

  const article = articles[slug];

  return (
    <AppLayout
      title={article.title}
      description={article.description}
      canonical={`/blog/${slug}`}
    >
      <section className="page-hero">
        <p className="section-label">Artigo em destaque</p>
        <h1>{article.title}</h1>
        <p className="page-copy">{article.description}</p>
      </section>

      <section className="container page-grid page-grid-2" style={{ gap: '2rem', marginBottom: '4rem' }}>
        <article className="page-card">
          <h2 className="page-heading">Resumo do artigo</h2>
          <p className="page-copy">{article.summary}</p>
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ color: 'var(--red)', fontWeight: 700, marginBottom: '0.75rem' }}>O que encontrará</h3>
            <ul style={{ paddingLeft: 18, color: 'var(--muted-light)', lineHeight: 1.75 }}>
              {article.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </article>

        <aside className="page-panel">
          <h2 className="page-heading">Destaques</h2>
          <p className="page-copy">A Tranzor partilha práticas alinhadas com as expectativas de empresas que desejam crescer com estabilidade e controlo.</p>
          <ul style={{ paddingLeft: 18, color: 'var(--muted-light)', lineHeight: 1.75, marginTop: '1rem' }}>
            <li>Soluções adaptadas ao seu setor.</li>
            <li>Implementação sem interrupções.</li>
            <li>Relatórios e indicadores claros.</li>
          </ul>
          <Link to="/blog" className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>Ver mais artigos</Link>
        </aside>
      </section>

      <section className="container page-panel" style={{ marginBottom: '4rem' }}>
        <h2 className="page-heading">Artigos para líderes</h2>
        <p className="page-copy">A Tranzor ajuda a sua equipa a adotar tecnologia com foco em resultados tangíveis e melhores decisões de negócio.</p>
      </section>
    </AppLayout>
  );
}
