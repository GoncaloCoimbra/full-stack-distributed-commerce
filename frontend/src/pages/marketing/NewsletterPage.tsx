import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function NewsletterPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Newsletter</h1>
				<p className="page-copy">
					Subscreva a newsletter Tranzor e receba novidades e promoções exclusivas.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Formulário de subscrição em breve.</p>
			</section>
		</AppLayout>
	);
}
