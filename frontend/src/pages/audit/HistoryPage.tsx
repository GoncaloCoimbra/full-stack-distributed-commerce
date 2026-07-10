import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function HistoryPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Histórico de Auditorias</h1>
				<p className="page-copy">
					Consulte o histórico completo das auditorias Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Histórico de auditorias em breve.</p>
			</section>
		</AppLayout>
	);
}
