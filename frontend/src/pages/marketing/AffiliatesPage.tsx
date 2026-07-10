import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function AffiliatesPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Programa de Afiliados</h1>
				<p className="page-copy">
					Junte-se ao programa de afiliados Tranzor e ganhe comissões promovendo nossos produtos.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Informações do programa em breve.</p>
			</section>
		</AppLayout>
	);
}
