import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function ShipmentManagePage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Gestão de Envios</h1>
				<p className="page-copy">
					Controle e acompanhe os envios de produtos Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Gestão de envios em breve.</p>
			</section>
		</AppLayout>
	);
}
