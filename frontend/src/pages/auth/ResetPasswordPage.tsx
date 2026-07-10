import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function ResetPasswordPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Redefinir Palavra-passe</h1>
				<p className="page-copy">
					Defina uma nova palavra-passe para a sua conta Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Formulário de redefinição em breve.</p>
			</section>
		</AppLayout>
	);
}
