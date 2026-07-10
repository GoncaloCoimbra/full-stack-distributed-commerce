import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function CreditNotePage() {
	const [filterStatus, setFilterStatus] = useState('all');

	const creditNotes = [
		{ id: 'NC-2024-001', invoiceRef: 'FAT-2024-050', customer: 'Empresa ABC Ltd', reason: 'Devolução Parcial', amount: '€850.00', issueDate: '2024-01-15', status: 'Aplicado' },
		{ id: 'NC-2024-002', invoiceRef: 'FAT-2024-048', customer: 'Distribuidora Central', reason: 'Erro de Quantidade', amount: '€1,200.50', issueDate: '2024-01-12', status: 'Pendente' },
		{ id: 'NC-2024-003', invoiceRef: 'FAT-2024-045', customer: 'Fornecedor Regional', reason: 'Desconto Negociado', amount: '€500.00', issueDate: '2024-01-10', status: 'Aplicado' },
		{ id: 'NC-2024-004', invoiceRef: 'FAT-2024-042', customer: 'Grupo Industrial', reason: 'Produto Danificado', amount: '€2,340.75', issueDate: '2024-01-08', status: 'Aplicado' },
		{ id: 'NC-2024-005', invoiceRef: 'FAT-2024-040', customer: 'Imports É Nice', reason: 'Devolução Total', amount: '€1,890.00', issueDate: '2024-01-05', status: 'Pendente' }
	];

	const filteredNotes = creditNotes.filter(note => {
		const matchesStatus = filterStatus === 'all' || note.status === filterStatus;
		return matchesStatus;
	});

	const stats = [
		{ label: 'Total de Notas', value: creditNotes.length, color: '#3b82f6' },
		{ label: 'Valor Total', value: '€' + creditNotes.reduce((sum, n) => sum + parseFloat(n.amount.replace('€', '')), 0).toFixed(2), color: '#10b981' },
		{ label: 'Aplicadas', value: creditNotes.filter(n => n.status === 'Aplicado').length, color: '#f59e0b' },
		{ label: 'Pendentes', value: creditNotes.filter(n => n.status === 'Pendente').length, color: '#ef4444' }
	];

	return (
		<AppLayout
			title="Notas de Crédito"
			description="Consulte, gere e gerencie notas de crédito para clientes Tranzor."
			canonical="/finance/credit-notes"
		>
			<section className="page-hero" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
				<h1 style={{ color: 'white' }}>Notas de Crédito</h1>
				<p className="page-copy" style={{ color: 'rgba(255,255,255,0.9)' }}>
					Consulte, gere e gerencie notas de crédito para devoluções e ajustes.
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
							<option value="all">Todos os Status</option>
							<option value="Aplicado">Aplicado</option>
							<option value="Pendente">Pendente</option>
						</select>
						<button style={{
							padding: '12px 24px',
							background: '#3b82f6',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							fontSize: '1rem',
							fontWeight: 600,
							cursor: 'pointer'
						}}
						>
							Nova Nota de Crédito
						</button>
					</div>

					{/* Tabela de Notas */}
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
							<h2 style={{ margin: 0, fontSize: '1.2rem' }}>Notas de Crédito ({filteredNotes.length})</h2>
						</div>
						<div style={{ overflowX: 'auto' }}>
							<table style={{ width: '100%', borderCollapse: 'collapse' }}>
								<thead>
									<tr style={{ borderBottom: '1px solid var(--border)' }}>
										<th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Número</th>
										<th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Referência</th>
										<th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Cliente</th>
										<th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Motivo</th>
										<th style={{ textAlign: 'right', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Valor</th>
										<th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Status</th>
									</tr>
								</thead>
								<tbody>
									{filteredNotes.map((note) => (
										<tr key={note.id} style={{ borderBottom: '1px solid var(--border)' }}>
											<td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600, color: '#3b82f6' }}>{note.id}</td>
											<td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--muted)' }}>{note.invoiceRef}</td>
											<td style={{ padding: '1rem', fontSize: '0.9rem' }}>{note.customer}</td>
											<td style={{ padding: '1rem', fontSize: '0.9rem' }}>{note.reason}</td>
											<td style={{ textAlign: 'right', padding: '1rem', fontSize: '0.95rem', fontWeight: 600 }}>{note.amount}</td>
											<td style={{ textAlign: 'center', padding: '1rem' }}>
												<span style={{
													background: note.status === 'Aplicado' ? '#d1fae5' : '#fef3c7',
													color: note.status === 'Aplicado' ? '#065f46' : '#92400e',
													padding: '0.4rem 0.8rem',
													borderRadius: '4px',
													fontSize: '0.85rem',
													fontWeight: 600
												}}
												>
													{note.status}
												</span>
											</td>
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
