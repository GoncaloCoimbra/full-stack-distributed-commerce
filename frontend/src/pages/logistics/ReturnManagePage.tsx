import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function ReturnManagePage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Gestão de Devoluções</h1>
				<p className="page-copy">
					Administre devoluções e trocas de produtos Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Gestão de devoluções em breve.</p>
			</section>
		</AppLayout>
	);
}
