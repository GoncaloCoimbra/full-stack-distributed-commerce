import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function StepShipping() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Método de Envio</h1>
				<p className="page-copy">
					Selecione o método de envio para a sua encomenda Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Opções de envio em breve.</p>
			</section>
		</AppLayout>
	);
}
