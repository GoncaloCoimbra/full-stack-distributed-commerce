import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function StepPayment() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Pagamento</h1>
				<p className="page-copy">
					Escolha o método de pagamento para concluir a sua compra Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Formulário de pagamento em breve.</p>
			</section>
		</AppLayout>
	);
}
