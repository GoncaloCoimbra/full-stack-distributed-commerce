import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function RevenueReportPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Relatório de Receitas</h1>
				<p className="page-copy">
					Veja relatórios detalhados de receitas Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<p>Relatórios de receitas em breve.</p>
			</section>
		</AppLayout>
	);
}
