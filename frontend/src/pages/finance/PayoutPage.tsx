import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function PayoutPage() {
	const [filterStatus, setFilterStatus] = useState('all');

	const payouts = [
		{ id: 'PAY-001', date: '2024-01-15', method: 'Transferência Bancária', amount: '€5,450.00', status: 'Processado', reference: 'TRF-2024-001' },
		{ id: 'PAY-002', date: '2024-01-12', method: 'Cartão de Crédito', amount: '€2,890.50', status: 'Processado', reference: 'CC-2024-045' },
		{ id: 'PAY-003', date: '2024-01-10', method: 'Transferência Bancária', amount: '€8,234.75', status: 'Processado', reference: 'TRF-2024-002' },
		{ id: 'PAY-004', date: '2024-01-08', method: 'PayPal', amount: '€3,120.00', status: 'Pendente', reference: 'PP-2024-156' },
		{ id: 'PAY-005', date: '2024-01-05', method: 'Transferência Bancária', amount: '€6,780.25', status: 'Processado', reference: 'TRF-2024-003' }
	];

	const filteredPayouts = payouts.filter(payout => {
		const matchesStatus = filterStatus === 'all' || payout.status === filterStatus;
		return matchesStatus;
	});

	const stats = [
		{ label: 'Total Pago', value: '€' + payouts.reduce((sum, p) => sum + parseFloat(p.amount.replace('€', '')), 0).toFixed(2), color: '#10b981' },
		{ label: 'Pagamentos Este Mês', value: payouts.length, color: '#3b82f6' },
		{ label: 'Pagamentos Processados', value: payouts.filter(p => p.status === 'Processado').length, color: '#f59e0b' },
		{ label: 'Pagamentos Pendentes', value: payouts.filter(p => p.status === 'Pendente').length, color: '#ef4444' }
	];

	return (
		<AppLayout
			title="Gestão de Pagamentos"
			description="Acompanhe e gerencie pagamentos, transferências e saídas de caixa Tranzor."
			canonical="/finance/payouts"
		>
			<section className="page-hero" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
				<h1 style={{ color: 'white' }}>Gestão de Pagamentos</h1>
				<p className="page-copy" style={{ color: 'rgba(255,255,255,0.9)' }}>
					Acompanhe transferências, processamentos e histórico de pagamentos.
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
							<option value="Processado">Processado</option>
							<option value="Pendente">Pendente</option>
						</select>
						<button style={{
							padding: '12px 24px',
							background: '#10b981',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							fontSize: '1rem',
							fontWeight: 600,
							cursor: 'pointer'
						}}
						>
							Novo Pagamento
						</button>
					</div>

					{/* Tabela de Pagamentos */}
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
							<h2 style={{ margin: 0, fontSize: '1.2rem' }}>Histórico de Pagamentos ({filteredPayouts.length})</h2>
						</div>
						<div style={{ overflowX: 'auto' }}>
							<table style={{ width: '100%', borderCollapse: 'collapse' }}>
								<thead>
									<tr style={{ borderBottom: '1px solid var(--border)' }}>
										<th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>ID</th>
										<th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Data</th>
										<th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Método</th>
										<th style={{ textAlign: 'right', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Valor</th>
										<th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Referência</th>
										<th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Status</th>
									</tr>
								</thead>
								<tbody>
									{filteredPayouts.map((payout) => (
										<tr key={payout.id} style={{ borderBottom: '1px solid var(--border)' }}>
											<td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600, color: '#10b981' }}>{payout.id}</td>
											<td style={{ padding: '1rem', fontSize: '0.9rem' }}>{payout.date}</td>
											<td style={{ padding: '1rem', fontSize: '0.9rem' }}>{payout.method}</td>
											<td style={{ textAlign: 'right', padding: '1rem', fontSize: '0.95rem', fontWeight: 600 }}>{payout.amount}</td>
											<td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--muted)' }}>{payout.reference}</td>
											<td style={{ textAlign: 'center', padding: '1rem' }}>
												<span style={{
													background: payout.status === 'Processado' ? '#d1fae5' : '#fef3c7',
													color: payout.status === 'Processado' ? '#065f46' : '#92400e',
													padding: '0.4rem 0.8rem',
													borderRadius: '4px',
													fontSize: '0.85rem',
													fontWeight: 600
												}}
												>
													{payout.status}
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
