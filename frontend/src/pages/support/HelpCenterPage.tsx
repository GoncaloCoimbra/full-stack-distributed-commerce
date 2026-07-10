import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function HelpCenterPage() {
	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Centro de Ajuda</h1>
				<p className="page-copy">
					Encontre respostas rápidas e suporte para todas as suas dúvidas Tranzor.
				</p>
			</section>
			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<ul style={{ paddingLeft: 18 }}>
					<li><a href="/faq" style={{ color: 'var(--primary)', fontWeight: 600 }}>Perguntas Frequentes</a></li>
					<li><a href="/support/ticket-new" style={{ color: 'var(--primary)', fontWeight: 600 }}>Abrir Ticket</a></li>
					<li><a href="/support/live-chat" style={{ color: 'var(--primary)', fontWeight: 600 }}>Chat ao Vivo</a></li>
				</ul>
			</section>
		</AppLayout>
	);
}
