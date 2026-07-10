import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function SupplierPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Fornecedores</h1>
				<p className="page-copy">
					Gerencie fornecedores e parceiros Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Gestão de fornecedores em breve.</p>
			</section>
		</AppLayout>
	);
}
