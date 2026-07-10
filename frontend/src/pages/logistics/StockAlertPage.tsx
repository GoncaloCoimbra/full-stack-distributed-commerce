import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function StockAlertPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Alertas de Stock</h1>
				<p className="page-copy">
					Receba alertas de stock baixo e reposição Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Alertas de stock em breve.</p>
			</section>
		</AppLayout>
	);
}
