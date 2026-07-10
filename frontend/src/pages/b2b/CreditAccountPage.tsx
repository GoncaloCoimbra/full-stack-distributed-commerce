import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function CreditAccountPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Conta Corrente B2B</h1>
				<p className="page-copy">
					Solicite e acompanhe o crédito da sua empresa com a Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Gestão de conta corrente em breve.</p>
			</section>
		</AppLayout>
	);
}
