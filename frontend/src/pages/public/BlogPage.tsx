import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';

const articles = [
  {
    slug: 'tendencias-2026',
    title: 'Tendências 2026',
    description: 'Como preparar a sua empresa para produção e venda mais eficientes no próximo ano.'
  },
  {
    slug: 'tecnologia-industrial',
    title: 'Tecnologia industrial',
    description: 'Estratégias para integrar automação, análise de dados e operações em cadeias de valor modernas.'
  },
  {
    slug: 'experiencia-retalho',
    title: 'Experiência de retalho',
    description: 'Melhore a experiência do cliente com soluções adaptadas ao comércio contemporâneo.'
  }
];

export default function BlogPage() {
	return (
		<AppLayout
			title="Blog"
			description="Acompanhe as tendências, notícias e insights do universo Tranzor."
			canonical="/blog"
		>
			<section className="page-hero">
				<p className="section-label">Insights</p>
				<h1>Conteúdo pensado para gestores de negócio e operações modernas.</h1>
				<p className="page-copy">
					A Tranzor partilha conhecimento técnico, casos de sucesso e novidades do setor para ajudar a sua empresa a crescer com estratégia.
				</p>
			</section>

			<section className="container page-grid page-grid-3" style={{ marginBottom: '4rem' }}>
				{articles.map((article) => (
					<article key={article.slug} className="page-card">
						<h2 className="page-heading">{article.title}</h2>
						<p className="page-copy">{article.description}</p>
						<Link to={`/blog/${article.slug}`} className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>
							Leia o artigo
						</Link>
					</article>
				))}
			</section>

			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<h2 className="page-heading">Uma publicação empresarial</h2>
				<p className="page-copy">Conteúdos curados para líderes que valorizam soluções sustentáveis, decisões digitais e crescimento sólido.</p>
			</section>
		</AppLayout>
	);
}
