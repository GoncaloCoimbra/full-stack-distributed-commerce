import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function InventoryPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Inventário</h1>
				<p className="page-copy">
					Consulte e administre o inventário de produtos Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Gestão de inventário em breve.</p>
			</section>
		</AppLayout>
	);
}
