import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function CouponPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Cupão de Desconto</h1>
				<p className="page-copy">
					Insira o seu cupão para obter descontos exclusivos Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Formulário de cupão em breve.</p>
			</section>
		</AppLayout>
	);
}
