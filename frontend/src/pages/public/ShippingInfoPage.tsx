import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function ShippingInfoPage() {
	return (
		<AppLayout
			title="Informações de Envio"
			description="Descubra os prazos, métodos e políticas de envio da Tranzor para compras e serviços." 
			canonical="/shipping"
		>
			<section className="page-hero">
				<p className="section-label">Envios</p>
				<h1>Logística transparente com prazos e opções claros.</h1>
				<p className="page-copy">
					A Tranzor assegura envios controlados, comunicação constante e condições adaptadas a cada cliente.
				</p>
			</section>

			<section className="container page-grid page-grid-2" style={{ marginBottom: '4rem' }}>
				<div className="page-card">
					<h2 className="page-heading">Prazos</h2>
					<p className="page-copy">Entrega padrão em 2 a 5 dias úteis para Portugal continental, com opções de expresso quando necessário.</p>
				</div>
				<div className="page-card">
					<h2 className="page-heading">Custos</h2>
					<p className="page-copy">O custo de envio é calculado no checkout e fornece alternativas de custo-eficiência ou velocidade.</p>
				</div>
			</section>

			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<h2 className="page-heading">Acompanhamento</h2>
				<p className="page-copy">Fornecemos informações de tracking e apoio dedicado para garantir que a sua encomenda chega com total confiança.</p>
			</section>
		</AppLayout>
	);
}
