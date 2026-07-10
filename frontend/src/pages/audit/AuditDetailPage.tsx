import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function AuditDetailPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Detalhe da Auditoria</h1>
				<p className="page-copy">
					Veja detalhes completos da auditoria Tranzor selecionada.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Detalhes da auditoria em breve.</p>
			</section>
		</AppLayout>
	);
}
