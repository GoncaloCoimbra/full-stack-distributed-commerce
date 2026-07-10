import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function BulkOrderPage() {
	const [quantity, setQuantity] = useState('');
	const [category, setCategory] = useState('papelaria');

	const categories = [
		{ id: 'papelaria', name: 'Papelaria', minQty: 100, unitPrice: '€4.99', discountAt100: '-5%', discountAt500: '-10%', discountAt1000: '-15%' },
		{ id: 'escolares', name: 'Escolares', minQty: 50, unitPrice: '€3.50', discountAt100: '-8%', discountAt500: '-12%', discountAt1000: '-18%' },
		{ id: 'artes', name: 'Artes', minQty: 25, unitPrice: '€8.99', discountAt100: '-7%', discountAt500: '-11%', discountAt1000: '-16%' },
		{ id: 'tecnologia', name: 'Tecnologia', minQty: 10, unitPrice: '€24.99', discountAt100: '-6%', discountAt500: '-10%', discountAt1000: '-14%' }
	];

	const benefits = [
		{ icon: '💵', title: 'Descontos Volume', desc: 'Quanto maior o pedido, maior o desconto' },
		{ icon: '🚛', title: 'Entrega Gratuita', desc: 'Frete grátis em pedidos acima de 5.000€' },
		{ icon: '📄', title: 'Fatura Customizada', desc: 'Emissão rápida e customização de termos' },
		{ icon: '📅', title: 'Prazos Flexíveis', desc: 'Condições de pagamento a negociar' }
	];

	const selectedCat = categories.find(c => c.id === category);

	return (
		<AppLayout
			title="Encomendas em Lote B2B"
			description="Faça pedidos de grandes quantidades com descontos especiais. Solução B2B com preços competitivos."
			canonical="/b2b/bulk-order"
		>
			<section className="page-hero" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
				<h1 style={{ color: 'white' }}>Encomendas em Lote</h1>
				<p className="page-copy" style={{ color: 'rgba(255,255,255,0.9)' }}>
					Descontos progressivos para grandes quantidades. Consulte-nos para negociar melhores condições.
				</p>
			</section>

			<section style={{ padding: '2rem 0' }}>
				<div className="container">
					{/* Benefícios */}
					<h2 style={{ marginBottom: '2rem' }}>Vantagens de Encomendas em Lote</h2>
					<div className="page-grid page-grid-4" style={{ marginBottom: '4rem' }}>
						{benefits.map((benefit, idx) => (
							<div key={idx} className="page-card" style={{ padding: '2rem', textAlign: 'center' }}>
								<div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{benefit.icon}</div>
								<h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{benefit.title}</h3>
								<p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>{benefit.desc}</p>
							</div>
						))}
					</div>

					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
						gap: '2rem',
						marginBottom: '3rem'
					}}>
						{/* Formulário */}
						<div style={{
							background: 'var(--charcoal-2)',
							borderRadius: '12px',
							border: '1px solid var(--border)',
							padding: '2rem'
						}}>
							<h3 style={{ margin: '0 0 1.5rem 0' }}>Solicitar Orçamento</h3>
							<div style={{ marginBottom: '1.5rem' }}>
								<label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Categoria *</label>
								<select
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									style={{
										width: '100%',
										padding: '12px',
										border: '1px solid var(--border)',
										borderRadius: '6px',
										background: 'var(--charcoal-3)',
										color: 'var(--text)',
										fontSize: '1rem',
										boxSizing: 'border-box'
									}}
								>
									{categories.map(cat => (
										<option key={cat.id} value={cat.id}>{cat.name}</option>
									))}
								</select>
							</div>
							<div style={{ marginBottom: '1.5rem' }}>
								<label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Quantidade *</label>
								<input
									type="number"
									min={selectedCat?.minQty}
									placeholder={`Mínimo: ${selectedCat?.minQty} un.`}
									value={quantity}
									onChange={(e) => setQuantity(e.target.value)}
									style={{
										width: '100%',
										padding: '12px',
										border: '1px solid var(--border)',
										borderRadius: '6px',
										background: 'var(--charcoal-3)',
										color: 'var(--text)',
										fontSize: '1rem',
										boxSizing: 'border-box'
									}}
								/>
							</div>
							<button
								style={{
									width: '100%',
									padding: '14px',
									background: '#8b5cf6',
									color: 'white',
									border: 'none',
									borderRadius: '6px',
									fontSize: '1rem',
									fontWeight: 600,
									cursor: 'pointer'
								}}
							>
								Solicitar Orçamento
							</button>
						</div>

						{/* Tabela de Descontos */}
						<div style={{
							background: 'var(--charcoal-2)',
							borderRadius: '12px',
							border: '1px solid var(--border)',
							padding: '2rem'
						}}>
							<h3 style={{ margin: '0 0 1.5rem 0' }}>Tabela de Descontos - {selectedCat?.name}</h3>
							<div style={{ display: 'grid', gap: '1rem' }}>
								<div style={{
									display: 'flex',
									justifyContent: 'space-between',
									padding: '1rem',
									background: 'var(--charcoal-3)',
									borderRadius: '6px'
								}}>
									<div>
										<div style={{ fontWeight: 600 }}>100 - 500 un.</div>
										<div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Preço unitário: {selectedCat?.unitPrice}</div>
									</div>
									<div style={{ color: '#10b981', fontWeight: 700 }}>{selectedCat?.discountAt100}</div>
								</div>
								<div style={{
									display: 'flex',
									justifyContent: 'space-between',
									padding: '1rem',
									background: 'var(--charcoal-3)',
									borderRadius: '6px'
								}}>
									<div>
										<div style={{ fontWeight: 600 }}>500 - 1.000 un.</div>
										<div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Preço unitário: {selectedCat?.unitPrice}</div>
									</div>
									<div style={{ color: '#10b981', fontWeight: 700 }}>{selectedCat?.discountAt500}</div>
								</div>
								<div style={{
									display: 'flex',
									justifyContent: 'space-between',
									padding: '1rem',
									background: 'var(--charcoal-3)',
									borderRadius: '6px'
								}}>
									<div>
										<div style={{ fontWeight: 600 }}>Acima de 1.000 un.</div>
										<div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Preço unitário: {selectedCat?.unitPrice}</div>
									</div>
									<div style={{ color: '#10b981', fontWeight: 700 }}>{selectedCat?.discountAt1000}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</AppLayout>
	);
}
