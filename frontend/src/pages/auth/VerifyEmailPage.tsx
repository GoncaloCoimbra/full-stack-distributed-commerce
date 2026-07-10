import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function VerifyEmailPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Verificar Email</h1>
				<p className="page-copy">
					Confirme o seu endereço de email para ativar a conta Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Verificação de email em breve.</p>
			</section>
		</AppLayout>
	);
}
