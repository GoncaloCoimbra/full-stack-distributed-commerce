import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function StepReview() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Rever Encomenda</h1>
				<p className="page-copy">
					Confirme os detalhes da sua encomenda Tranzor antes de finalizar.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Resumo da encomenda em breve.</p>
			</section>
		</AppLayout>
	);
}
