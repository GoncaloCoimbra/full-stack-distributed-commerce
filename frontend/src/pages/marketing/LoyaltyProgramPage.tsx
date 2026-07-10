import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function LoyaltyProgramPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Programa de Fidelização</h1>
				<p className="page-copy">
					Acumule pontos e beneficie de vantagens exclusivas Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Detalhes do programa em breve.</p>
			</section>
		</AppLayout>
	);
}
