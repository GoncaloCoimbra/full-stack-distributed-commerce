import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function InvoiceAdminPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Faturas</h1>
				<p className="page-copy">
					Gestão e emissão de faturas Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Gestão de faturas em breve.</p>
			</section>
		</AppLayout>
	);
}
