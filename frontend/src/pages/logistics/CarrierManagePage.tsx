import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function CarrierManagePage() {
	const [selectedCarrier, setSelectedCarrier] = useState('ctt');

	const carriers = [
		{ id: 'ctt', name: 'CTT Express', rating: 4.7, deliveryTime: '2-3 dias', costPerKg: '€0.85', coverage: '95%', volume: '28,450' },
		{ id: 'dhl', name: 'DHL International', rating: 4.8, deliveryTime: '1-2 dias', costPerKg: '€1.20', coverage: '99%', volume: '42,100' },
		{ id: 'fedex', name: 'FedEx Portugal', rating: 4.6, deliveryTime: '2-4 dias', costPerKg: '€0.95', coverage: '92%', volume: '15,230' },
		{ id: 'tnt', name: 'TNT Logistics', rating: 4.5, deliveryTime: '3-5 dias', costPerKg: '€0.75', coverage: '88%', volume: '8,670' },
	];

	const selectedCarrierData = carriers.find(c => c.id === selectedCarrier);

	const shipments = [
		{ date: '2024-01-15', destination: 'Lisboa', items: 45, status: 'Entregue', cost: '€142.50' },
		{ date: '2024-01-14', destination: 'Porto', items: 78, status: 'Em trânsito', cost: '€156.80' },
		{ date: '2024-01-13', destination: 'Covilhã', items: 32, status: 'Entregue', cost: '€98.40' },
		{ date: '2024-01-12', destination: 'Braga', items: 56, status: 'Entregue', cost: '€128.90' },
		{ date: '2024-01-11', destination: 'Faro', items: 23, status: 'Entregue', cost: '€87.30' }
	];

	return (
		<AppLayout
			title="Gestão de Transportadoras"
			description="Gerencie parceiros logísticos, compare tarifas e rastreie desempenho de transportadoras."
			canonical="/logistics/carriers"
		>
			<section className="page-hero" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
				<h1 style={{ color: 'white' }}>Gestão de Transportadoras</h1>
				<p className="page-copy" style={{ color: 'rgba(255,255,255,0.9)' }}>
					Gerencie parceiros logísticos, compare tarifas e otimize custos de envio.
				</p>
			</section>

			<section style={{ padding: '2rem 0' }}>
				<div className="container">
					{/* Seletor de Transportadoras */}
					<h2 style={{ marginBottom: '1.5rem' }}>Transportadoras Parceiras</h2>
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
						gap: '1rem',
						marginBottom: '3rem'
					}}>
						{carriers.map(carrier => (
							<div
								key={carrier.id}
								onClick={() => setSelectedCarrier(carrier.id)}
								style={{
									padding: '1.5rem',
									border: selectedCarrier === carrier.id ? '2px solid #8b5cf6' : '1px solid var(--border)',
									background: 'var(--charcoal-2)',
									borderRadius: '8px',
									cursor: 'pointer',
									transition: 'all 0.3s'
								}}
							>
								<h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem' }}>{carrier.name}</h3>
								<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
									<span style={{ color: '#fbbf24', fontWeight: 600 }}>★ {carrier.rating}</span>
								</div>
								<div style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>
									<div>Entrega: {carrier.deliveryTime}</div>
									<div>Cobertura: {carrier.coverage}</div>
								</div>
							</div>
						))}
					</div>

					{/* Detalhes da Transportadora Selecionada */}
					{selectedCarrierData && (
						<div style={{
							background: 'var(--charcoal-2)',
							borderRadius: '12px',
							border: '1px solid var(--border)',
							padding: '2rem',
							marginBottom: '3rem'
						}}>
							<h3 style={{ margin: '0 0 1.5rem 0' }}>Detalhes - {selectedCarrierData.name}</h3>
							<div className="page-grid page-grid-4" style={{ marginBottom: '2rem' }}>
								<div>
									<div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Taxa por Kg</div>
									<div style={{ fontWeight: 600, fontSize: '1.2rem' }}>{selectedCarrierData.costPerKg}</div>
								</div>
								<div>
									<div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Cobertura</div>
									<div style={{ fontWeight: 600, fontSize: '1.2rem' }}>{selectedCarrierData.coverage}</div>
								</div>
								<div>
									<div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Volume Mensal</div>
									<div style={{ fontWeight: 600, fontSize: '1.2rem' }}>{selectedCarrierData.volume} kg</div>
								</div>
								<div>
									<div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Avaliação</div>
									<div style={{ fontWeight: 600, fontSize: '1.2rem', color: '#fbbf24' }}>★ {selectedCarrierData.rating}</div>
								</div>
							</div>
							<h4 style={{ margin: '1.5rem 0 1rem 0' }}>Envios Recentes</h4>
							<div style={{ overflowX: 'auto' }}>
								<table style={{ width: '100%', borderCollapse: 'collapse' }}>
									<thead>
										<tr style={{ borderBottom: '1px solid var(--border)' }}>
											<th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>Data</th>
											<th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>Destino</th>
											<th style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>Itens</th>
											<th style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>Status</th>
											<th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>Custo</th>
										</tr>
									</thead>
									<tbody>
										{shipments.map((ship, idx) => (
											<tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
												<td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{ship.date}</td>
												<td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>{ship.destination}</td>
												<td style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.9rem' }}>{ship.items}</td>
												<td style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.85rem' }}>
													<span style={{
														background: ship.status === 'Entregue' ? '#d1fae5' : '#fef3c7',
														color: ship.status === 'Entregue' ? '#065f46' : '#92400e',
														padding: '0.25rem 0.6rem',
														borderRadius: '3px',
														fontSize: '0.75rem',
														fontWeight: 600
													}}
													>
														{ship.status}
													</span>
												</td>
												<td style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>{ship.cost}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			</section>
		</AppLayout>
	);
}
