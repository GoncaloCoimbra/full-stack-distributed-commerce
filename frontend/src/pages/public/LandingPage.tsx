import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function LandingPage() {
	return (
		<AppLayout
			title="Landing"
			description="Explore as ofertas da Tranzor para empresas que buscam tecnologia, operação e sustentabilidade." 
			canonical="/landing"
		>
			<section className="page-hero">
				<p className="section-label">Serviços estratégicos</p>
				<h1>Soluções corporativas alinhadas com metas de crescimento.</h1>
				<p className="page-copy">
					A Tranzor oferece serviços que combinam eficiência operacional, tecnologia aplicada e responsabilidade social.
				</p>
			</section>

			<section className="container page-grid page-grid-3" style={{ marginBottom: '4rem' }}>
				<div className="page-card">
					<h2 className="page-heading">Indústria</h2>
					<p className="page-copy">Ferramentas e processos que permitem operações mais rápidas e seguras.</p>
				</div>
				<div className="page-card">
					<h2 className="page-heading">Comércio</h2>
					<p className="page-copy">Experiências de venda modernas que elevam a perceção do cliente e as taxas de conversão.</p>
				</div>
				<div className="page-card">
					<h2 className="page-heading">Sustentabilidade</h2>
					<p className="page-copy">Práticas responsáveis e soluções mais eficientes para cada fase da cadeia de valor.</p>
				</div>
			</section>

			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<h2 className="page-heading">Modelo de parceria</h2>
				<p className="page-copy">Qualidade, transparência e entrega continuada: um caminho claro desde o projeto à operação.</p>
			</section>
		</AppLayout>
	);
}
