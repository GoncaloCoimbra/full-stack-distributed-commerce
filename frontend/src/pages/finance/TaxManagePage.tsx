import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function TaxManagePage() {
	const [filterType, setFilterType] = useState('all');

	const taxRules = [
		{ id: 'TAX-001', name: 'IVA Estándar', rate: '23%', type: 'IVA', region: 'Portugal', status: 'Ativo' },
		{ id: 'TAX-002', name: 'IVA Reduzido', rate: '13%', type: 'IVA', region: 'Portugal', status: 'Ativo' },
		{ id: 'TAX-003', name: 'IVA Super Reduzido', rate: '6%', type: 'IVA', region: 'Portugal', status: 'Ativo' },
		{ id: 'TAX-004', name: 'Imposto de Selo', rate: '0.8%', type: 'Selo', region: 'Portugal', status: 'Ativo' },
		{ id: 'TAX-005', name: 'Contribuição Social ISS', rate: '3.5%', type: 'ISS', region: 'Portugal', status: 'Inativo' },
	];

	const exemptions = [
		{ id: 'EXE-001', description: 'Educação e Formação', taxType: 'IVA', status: 'Ativo' },
		{ id: 'EXE-002', description: 'Saúde e Medicina', taxType: 'IVA', status: 'Ativo' },
		{ id: 'EXE-003', description: 'Serviços Financeiros', taxType: 'IVA', status: 'Ativo' },
		{ id: 'EXE-004', description: 'Seguros', taxType: 'IVA', status: 'Inativo' },
	];

	const filteredRules = filterType === 'all' ? taxRules : taxRules.filter(rule => rule.status === filterType);

	const stats = [
		{ label: 'Regras Ativas', value: taxRules.filter(r => r.status === 'Ativo').length, color: '#10b981' },
		{ label: 'Regras Inativas', value: taxRules.filter(r => r.status === 'Inativo').length, color: '#ef4444' },
		{ label: 'Isenções', value: exemptions.filter(e => e.status === 'Ativo').length, color: '#3b82f6' },
		{ label: 'Tipos de Imposto', value: new Set(taxRules.map(r => r.type)).size, color: '#f59e0b' }
	];

	return (
		<AppLayout
			title="Gestão de Impostos"
			description="Configure e administre regras fiscais, impostos e isenções para Tranzor."
			canonical="/finance/tax-management"
		>
			<section className="page-hero" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}>
				<h1 style={{ color: 'white' }}>Gestão de Impostos</h1>
				<p className="page-copy" style={{ color: 'rgba(255,255,255,0.9)' }}>
					Configure, administre e audite regras fiscais e aliquotas de imposto.
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

					{/* Secção Regras de Impostos */}
					<div style={{
						background: 'var(--charcoal-2)',
						borderRadius: '12px',
						border: '1px solid var(--border)',
						overflow: 'hidden',
						marginBottom: '2rem'
					}}>
						<div style={{
							padding: '1.5rem',
							borderBottom: '1px solid var(--border)',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}>
							<h2 style={{ margin: 0, fontSize: '1.2rem' }}>Regras de Impostos</h2>
							<select
								value={filterType}
								onChange={(e) => setFilterType(e.target.value)}
								style={{
									padding: '8px 12px',
									border: '1px solid var(--border)',
									borderRadius: '6px',
									background: 'var(--charcoal-3)',
									color: 'var(--text)',
									fontSize: '0.9rem'
								}}
							>
								<option value="all">Todos</option>
								<option value="Ativo">Ativos</option>
								<option value="Inativo">Inativos</option>
							</select>
						</div>
						<div style={{ overflowX: 'auto' }}>
							<table style={{ width: '100%', borderCollapse: 'collapse' }}>
								<thead>
									<tr style={{ borderBottom: '1px solid var(--border)' }}>
										<th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>ID</th>
										<th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Nome</th>
										<th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Tipo</th>
										<th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Aliquota</th>
										<th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Status</th>
									</tr>
								</thead>
								<tbody>
									{filteredRules.map((rule) => (
										<tr key={rule.id} style={{ borderBottom: '1px solid var(--border)' }}>
											<td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600, color: '#0ea5e9' }}>{rule.id}</td>
											<td style={{ padding: '1rem', fontSize: '0.9rem' }}>{rule.name}</td>
											<td style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem' }}
                                            >
												<span style={{
													background: 'var(--charcoal-3)',
													padding: '0.3rem 0.6rem',
													borderRadius: '4px',
												}}
												>
													{rule.type}
												</span>
											</td>
											<td style={{ textAlign: 'center', padding: '1rem', fontSize: '0.95rem', fontWeight: 600 }}>
												{rule.rate}
											</td>
											<td style={{ textAlign: 'center', padding: '1rem' }}>
												<span style={{
													background: rule.status === 'Ativo' ? '#d1fae5' : '#fee2e2',
													color: rule.status === 'Ativo' ? '#065f46' : '#991b1b',
													padding: '0.4rem 0.8rem',
													borderRadius: '4px',
													fontSize: '0.85rem',
													fontWeight: 600
												}}
												>
													{rule.status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Secção Isenções */}
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
							<h2 style={{ margin: 0, fontSize: '1.2rem' }}>Isenções Fiscais</h2>
						</div>
						<div style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
							gap: '1rem',
							padding: '1.5rem'
						}}>
							{exemptions.map((exemption) => (
								<div key={exemption.id} style={{
									background: 'var(--charcoal-3)',
									borderRadius: '8px',
									border: '1px solid var(--border)',
									padding: '1rem'
								}}>
									<div style={{ marginBottom: '0.75rem' }}>
										<div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{exemption.description}</div>
										<div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
											<span style={{
												background: '#dbeafe',
												color: '#0c4a6e',
												padding: '0.2rem 0.5rem',
												borderRadius: '3px',
												fontSize: '0.75rem',
												fontWeight: 600
											}}
											>
												{exemption.taxType}
											</span>
											<span style={{
												background: exemption.status === 'Ativo' ? '#d1fae5' : '#fee2e2',
												color: exemption.status === 'Ativo' ? '#065f46' : '#991b1b',
												padding: '0.2rem 0.5rem',
												borderRadius: '3px',
												fontSize: '0.75rem',
												fontWeight: 600
											}}
											>
												{exemption.status}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</AppLayout>
	);
}
