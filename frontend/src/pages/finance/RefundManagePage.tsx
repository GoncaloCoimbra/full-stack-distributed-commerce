import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function RefundManagePage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Reembolsos</h1>
				<p className="page-copy">
					Gerencie pedidos e processamento de reembolsos Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Gestão de reembolsos em breve.</p>
			</section>
		</AppLayout>
	);
}
