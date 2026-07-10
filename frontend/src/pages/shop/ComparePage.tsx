import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function ComparePage() {
	const products = [
		{ id: 1, name: 'Caderno A4 200pg', category: 'Escolares', price: '€3.99', rating: 4.7, stock: 'Alto', warranty: '1 ano', shipping: '48h' },
		{ id: 2, name: 'Caneta Azul Ballpoint', category: 'Escolares', price: '€0.45', rating: 4.6, stock: 'Alto', warranty: '6 meses', shipping: '24h' },
		{ id: 3, name: 'Tinta de Impressora', category: 'Tecnologia', price: '€15.99', rating: 4.6, stock: 'Médio', warranty: '90 dias', shipping: '72h' }
	];

	const [selected, setSelected] = useState([1, 2]);

	const toggleProduct = (id: number) => {
		setSelected(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id].slice(0, 3));
	};

	const selectedProducts = products.filter(product => selected.includes(product.id));

	return (
		<AppLayout
			title="Comparar Produtos"
			description="Compare preços, avaliações e características de produtos Tranzor."
			canonical="/shop/compare"
		>
			<section className="page-hero" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}>
				<h1 style={{ color: 'white' }}>Comparar Produtos</h1>
				<p className="page-copy" style={{ color: 'rgba(255,255,255,0.9)' }}>
					Compare rapidamente especificações, preços e disponibilidade.
				</p>
			</section>

			<section style={{ padding: '2rem 0' }}>
				<div className="container">
					<div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
						<div style={{ fontWeight: 700 }}>Selecione até 3 produtos</div>
						<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
							{products.map(product => (
								<button
									key={product.id}
									onClick={() => toggleProduct(product.id)}
									style={{
										padding: '12px 18px',
										borderRadius: '10px',
										border: selected.includes(product.id) ? '2px solid #f97316' : '1px solid var(--border)',
										background: selected.includes(product.id) ? 'rgba(249,115,22,0.15)' : 'var(--charcoal-3)',
										color: 'var(--text)',
										fontWeight: 700,
										cursor: 'pointer'
									}}
								>
									{product.name}
								</button>
							))}
						</div>
					</div>

					<div style={{
						background: 'var(--charcoal-2)',
						borderRadius: '12px',
						border: '1px solid var(--border)',
						overflowX: 'auto'
					}}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ borderBottom: '1px solid var(--border)' }}>
									<th style={{ padding: '1rem', textAlign: 'left', color: 'var(--muted)', fontWeight: 600 }}>Característica</th>
									{selectedProducts.map(product => (
										<th key={product.id} style={{ padding: '1rem', textAlign: 'center', minWidth: 180, color: 'var(--text)' }}>{product.name}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{[
									{ label: 'Categoria', key: 'category' },
									{ label: 'Preço', key: 'price' },
									{ label: 'Avaliação', key: 'rating' },
									{ label: 'Disponibilidade', key: 'stock' },
									{ label: 'Garantia', key: 'warranty' },
									{ label: 'Envio', key: 'shipping' }
								].map(row => (
									<tr key={row.key} style={{ borderBottom: '1px solid var(--border)' }}>
										<td style={{ padding: '1rem', fontWeight: 600, color: 'var(--muted)' }}>{row.label}</td>
										{selectedProducts.map(product => (
											<td key={product.id} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text)' }}>
												{product[row.key as keyof typeof product]}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</section>
		</AppLayout>
	);
}
