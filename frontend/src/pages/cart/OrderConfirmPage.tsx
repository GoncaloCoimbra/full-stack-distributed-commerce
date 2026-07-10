import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function OrderConfirmPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Encomenda Confirmada</h1>
				<p className="page-copy">
					Obrigado pela sua compra! A sua encomenda Tranzor foi recebida com sucesso.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Receberá um email com os detalhes da sua encomenda.</p>
			</section>
		</AppLayout>
	);
}
