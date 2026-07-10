import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function PricingPage() {
	return (
		<AppLayout
			title="Planos e Preços"
			description="Compare os planos Tranzor e escolha a solução que melhor suporta o seu crescimento." 
			canonical="/pricing"
		>
			<section className="page-hero">
				<p className="section-label">Planos</p>
				<h1>Preços claros para empresas com objetivos ambiciosos.</h1>
				<p className="page-copy">
					Cada plano inclui apoio técnico e comercial, com opções adaptadas a operações simples ou ambientes corporativos complexos.
				</p>
			</section>

			<section className="container page-grid page-grid-3" style={{ marginBottom: '4rem' }}>
				<div className="page-card">
					<h2 className="page-heading">Essencial</h2>
					<p className="page-copy">Ideal para empresas que começam a digitalizar processos e precisam de suporte profissional.</p>
					<ul style={{ paddingLeft: 18, marginTop: '1rem', color: 'var(--muted-light)', lineHeight: 1.75 }}>
						<li>Suporte técnico regular</li>
						<li>Consultoria de entrada</li>
						<li>Implementação ágil</li>
					</ul>
				</div>
				<div className="page-card" style={{ borderColor: 'rgba(217,4,41,0.28)' }}>
					<h2 className="page-heading">Profissional</h2>
					<p className="page-copy">Para equipas que exigem respostas rápidas, integração avançada e apoio dedicado.</p>
					<ul style={{ paddingLeft: 18, marginTop: '1rem', color: 'var(--muted-light)', lineHeight: 1.75 }}>
						<li>Suporte prioritário</li>
						<li>Consultoria operacional</li>
						<li>Relatórios personalizados</li>
					</ul>
					<div style={{ marginTop: '1.5rem' }}>
						<span className="btn btn-primary">Recomendado</span>
					</div>
				</div>
				<div className="page-card">
					<h2 className="page-heading">Premium</h2>
					<p className="page-copy">A solução mais completa, com acompanhamento contínuo e projeto totalmente adaptado.</p>
					<ul style={{ paddingLeft: 18, marginTop: '1rem', color: 'var(--muted-light)', lineHeight: 1.75 }}>
						<li>Gestão de projeto dedicada</li>
						<li>Consultoria estratégica</li>
						<li>Serviços completos Tranzor</li>
					</ul>
				</div>
			</section>

			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<h2 className="page-heading">Escolha com confiança</h2>
				<p className="page-copy">A Tranzor fornece transparência em custos e opções de evolução para que sua empresa possa crescer com controle e performance.</p>
			</section>
		</AppLayout>
	);
}
