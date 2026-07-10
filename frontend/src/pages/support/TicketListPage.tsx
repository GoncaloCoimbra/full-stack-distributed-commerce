import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function TicketListPage() {
	const [filterStatus, setFilterStatus] = useState('all');

	const tickets = [
		{ id: 'TKT-2024-001', subject: 'Problema com entrega', category: 'Logística', status: 'Resolvido', createdAt: '2024-01-15', updatedAt: '2024-01-16', priority: 'Alta' },
		{ id: 'TKT-2024-002', subject: 'Produto com defeito', category: 'Qualidade', status: 'Em Progresso', createdAt: '2024-01-14', updatedAt: '2024-01-14', priority: 'Alta' },
		{ id: 'TKT-2024-003', subject: 'Dúvida sobre fatura', category: 'Financeiro', status: 'Pendente', createdAt: '2024-01-13', updatedAt: '2024-01-13', priority: 'Média' },
		{ id: 'TKT-2024-004', subject: 'Reembolso solicitado', category: 'Reembolsos', status: 'Resolvido', createdAt: '2024-01-12', updatedAt: '2024-01-14', priority: 'Alta' },
		{ id: 'TKT-2024-005', subject: 'Acesso perdido à conta', category: 'Acesso', status: 'Resolvido', createdAt: '2024-01-11', updatedAt: '2024-01-11', priority: 'Crítica' },
		{ id: 'TKT-2024-006', subject: 'Perguntas sobre desconto', category: 'Geral', status: 'Resolvido', createdAt: '2024-01-10', updatedAt: '2024-01-10', priority: 'Baixa' }
	];

	const filteredTickets = tickets.filter(ticket => {
		const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
		return matchesStatus;
	});

	const statusColors = {
		'Resolvido': { bg: '#d1fae5', color: '#065f46' },
		'Em Progresso': { bg: '#dbeafe', color: '#0c4a6e' },
		'Pendente': { bg: '#fef3c7', color: '#92400e' }
	};

	const priorityColors = {
		'Baixa': '#10b981',
		'Média': '#f59e0b',
		'Alta': '#ef4444',
		'Crítica': '#dc2626'
	};

	const stats = [
		{ label: 'Total de Tickets', value: tickets.length, color: '#3b82f6' },
		{ label: 'Resolvidos', value: tickets.filter(t => t.status === 'Resolvido').length, color: '#10b981' },
		{ label: 'Em Progresso', value: tickets.filter(t => t.status === 'Em Progresso').length, color: '#3b82f6' },
		{ label: 'Pendentes', value: tickets.filter(t => t.status === 'Pendente').length, color: '#ef4444' }
	];

	return (
		<AppLayout
			title="Meus Tickets de Suporte"
			description="Acompanhe e gerencie seus pedidos de suporte Tranzor."
			canonical="/support/tickets"
		>
			<section className="page-hero" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
				<h1 style={{ color: 'white' }}>Meus Tickets de Suporte</h1>
				<p className="page-copy" style={{ color: 'rgba(255,255,255,0.9)' }}>
					Acompanhe todos seus pedidos de suporte e obtenha respostas rápidas.
				</p>
			</section>

			<section style={{ padding: '2rem 0' }}>
				<div className="container">
					{/* KPI Cards */}
					<div className="page-grid page-grid-4" style={{ marginBottom: '3rem' }}>
						{stats.map((stat, idx) => (
							<div key={idx} className="page-card">
								<div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{stat.label}</div>
								<div style={{ fontSize: '1.8rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
							</div>
						))}
					</div>

					{/* Filtro */}
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
						gap: '1rem',
						marginBottom: '2rem'
					}}>
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							style={{
								padding: '12px',
								border: '1px solid var(--border)',
								borderRadius: '6px',
								background: 'var(--charcoal-3)',
								color: 'var(--text)',
								fontSize: '1rem'
							}}
						>
							<option value="all">Todos os Tickets</option>
							<option value="Resolvido">Resolvido</option>
							<option value="Em Progresso">Em Progresso</option>
							<option value="Pendente">Pendente</option>
						</select>
						<button style={{
							padding: '12px 24px',
							background: '#06b6d4',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							fontSize: '1rem',
							fontWeight: 600,
							cursor: 'pointer'
						}}
						>
							Novo Ticket
						</button>
					</div>

					{/* Tabela de Tickets */}
					<div style={{
						background: 'var(--charcoal-2)',
						borderRadius: '12px',
						border: '1px solid var(--border)',
						overflow: 'hidden'
					}}>
						<div style={{
							padding: '1.5rem',
							borderBottom: '1px solid var(--border)'
						}}>
							<h2 style={{ margin: 0, fontSize: '1.2rem' }}>Tickets ({filteredTickets.length})</h2>
						</div>
						<div style={{ overflowX: 'auto' }}>
							<table style={{ width: '100%', borderCollapse: 'collapse' }}>
								<thead>
									<tr style={{ borderBottom: '1px solid var(--border)' }}>
										<th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>ÍD</th>
										<th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Assunto</th>
										<th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Categoria</th>
										<th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Prioridade</th>
										<th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Status</th>
										<th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Criado em</th>
									</tr>
								</thead>
								<tbody>
									{filteredTickets.map((ticket) => (
										<tr key={ticket.id} style={{ borderBottom: '1px solid var(--border)' }}>
											<td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600, color: '#06b6d4' }}>{ticket.id}</td>
											<td style={{ padding: '1rem', fontSize: '0.9rem' }}>{ticket.subject}</td>
											<td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--muted)' }}>{ticket.category}</td>
											<td style={{ textAlign: 'center', padding: '1rem' }}>
												<span style={{
													background: priorityColors[ticket.priority],
													color: 'white',
													padding: '0.4rem 0.8rem',
													borderRadius: '4px',
													fontSize: '0.8rem',
													fontWeight: 600
												}}
												>
													{ticket.priority}
												</span>
											</td>
											<td style={{ textAlign: 'center', padding: '1rem' }}>
												<span style={{
													background: statusColors[ticket.status].bg,
													color: statusColors[ticket.status].color,
													padding: '0.4rem 0.8rem',
													borderRadius: '4px',
													fontSize: '0.85rem',
													fontWeight: 600
												}}
												>
													{ticket.status}
												</span>
											</td>
											<td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--muted)' }}>{ticket.createdAt}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>
		</AppLayout>
	);
}
