import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function WarehousePage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Armazéns</h1>
				<p className="page-copy">
					Administre armazéns e gestão de stock Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Gestão de armazéns em breve.</p>
			</section>
		</AppLayout>
	);
}
