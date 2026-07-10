import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function CategoryManagePage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Gestão de Categorias</h1>
				<p className="page-copy">
					Adicione, edite ou remova categorias de produtos Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Gestão de categorias em breve.</p>
			</section>
		</AppLayout>
	);
}
