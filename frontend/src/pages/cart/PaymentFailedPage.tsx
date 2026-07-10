import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function PaymentFailedPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Pagamento Falhou</h1>
				<p className="page-copy">
					Ocorreu um erro no pagamento. Por favor, tente novamente ou contacte o suporte Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Se o problema persistir, contacte o suporte Tranzor.</p>
			</section>
		</AppLayout>
	);
}
