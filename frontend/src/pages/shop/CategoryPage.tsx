import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';

export default function CategoryPage() {
	const [selectedFilter, setSelectedFilter] = useState('todos');

	const subcategories = [
		{ name: 'Canetas & Lápis', count: '1.200', link: '/shop/papelaria/canetas' },
		{ name: 'Cadernos & Blocos', count: '800', link: '/shop/papelaria/cadernos' },
		{ name: 'Marcadores & Colores', count: '650', link: '/shop/papelaria/marcadores' },
		{ name: 'Adesivos & Etiquetas', count: '450', link: '/shop/papelaria/adesivos' },
		{ name: 'Papéis Especiais', count: '380', link: '/shop/papelaria/papeis' },
		{ name: 'Embalagem & Envio', count: '920', link: '/shop/papelaria/embalagem' },
	];

	const products = [
		{ name: 'Caneta Pilot G-2 0.7mm', price: '€12,99', rating: '4.8★', badge: 'Sale' },
		{ name: 'Caderno Oxford A4 200Fls', price: '€5,49', rating: '4.6★' },
		{ name: 'Marcadores Stabilo Boss', price: '€8,29', rating: '4.7★', badge: 'Novo' },
		{ name: 'Papel Navigator A4 500Fls', price: '€7,99', rating: '4.9★', badge: 'Sale' },
		{ name: 'Lápis Staedtler HB 12un', price: '€4,99', rating: '4.5★' },
		{ name: 'Borracha Milan 3854 Soft', price: '€1,49', rating: '4.4★' },
	];

	const filters = ['Todos', 'Em promoção', 'Mais vendidos', 'Novidades', 'Marcas'];

	return (
		<AppLayout>
			<section className="page-hero">
				<h1>Papelaria</h1>
				<p className="page-copy">
					Descubra a nossa completa seleção de artigos de papelaria, das principais marcas. Qualidade garantida.
				</p>
			</section>

			{/* Filtros */}
			<section style={{ background: 'var(--charcoal-2)', padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', marginBottom: '4rem' }}>
				<div className="container" style={{ maxWidth: '1280px' }}>
					<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
						{filters.map(f => (
							<button
								key={f}
								onClick={() => setSelectedFilter(f)}
								style={{
									background: selectedFilter === f ? 'rgba(217,4,41,0.12)' : 'var(--charcoal-3)',
									color: selectedFilter === f ? 'var(--red)' : 'var(--text-muted)',
									border: selectedFilter === f ? '1px solid rgba(217,4,41,0.5)' : '1px solid var(--border)',
									padding: '8px 16px',
									borderRadius: '99px',
									cursor: 'pointer',
									fontFamily: 'var(--font-display)',
									fontWeight: 600,
									fontSize: '13px',
									transition: 'all 0.2s ease'
								}}
								onMouseEnter={(e) => {
									const el = e.currentTarget as HTMLElement;
									if (selectedFilter !== f) {
										el.style.borderColor = 'var(--red)';
										el.style.color = 'var(--text)';
									}
								}}
								onMouseLeave={(e) => {
									const el = e.currentTarget as HTMLElement;
									if (selectedFilter !== f) {
										el.style.borderColor = 'var(--border)';
										el.style.color = 'var(--text-muted)';
									}
								}}
							>
								{f}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Subcategorias */}
			<section style={{ padding: '2rem', marginBottom: '4rem', borderBottom: '1px solid var(--border)' }}>
				<div className="container" style={{ maxWidth: '1280px' }}>
					<h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text)' }}>Subcategorias</h2>
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
						{subcategories.map(sub => (
							<Link key={sub.name} to={sub.link} style={{ textDecoration: 'none' }}>
								<div style={{
									background: 'var(--charcoal-2)',
									border: '1px solid var(--border)',
									borderRadius: '8px',
									padding: '1.25rem',
									textAlign: 'center',
									transition: 'all 0.3s ease'
								}}
								onMouseEnter={(e) => {
									const el = e.currentTarget as HTMLElement;
									el.style.borderColor = 'rgba(217,4,41,0.35)';
									el.style.background = 'var(--charcoal-3)';
									el.style.transform = 'translateY(-2px)';
								}}
								onMouseLeave={(e) => {
									const el = e.currentTarget as HTMLElement;
									el.style.borderColor = 'var(--border)';
									el.style.background = 'var(--charcoal-2)';
									el.style.transform = 'translateY(0)';
								}}>
									<h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', fontSize: '14px' }}>{sub.name}</h3>
									<p style={{ color: 'var(--red)', fontWeight: 600, fontSize: '12px', margin: 0 }}>{sub.count} produtos</p>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Produtos */}
			<section style={{ padding: '2rem' }}>
				<div className="container" style={{ maxWidth: '1280px' }}>
					<h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text)' }}>Produtos populares</h2>
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
						{products.map(prod => (
							<div key={prod.name} style={{
								background: 'var(--charcoal-2)',
								border: '1px solid var(--border)',
								borderRadius: '8px',
								overflow: 'hidden',
								transition: 'all 0.3s ease'
							}}
							onMouseEnter={(e) => {
								const el = e.currentTarget as HTMLElement;
								el.style.borderColor = 'rgba(217,4,41,0.35)';
								el.style.transform = 'translateY(-4px)';
								el.style.background = 'var(--charcoal-3)';
							}}
							onMouseLeave={(e) => {
								const el = e.currentTarget as HTMLElement;
								el.style.borderColor = 'var(--border)';
								el.style.transform = 'translateY(0)';
								el.style.background = 'var(--charcoal-2)';
							}}>
								<div style={{ background: 'linear-gradient(135deg, var(--charcoal-3) 0%, var(--mid) 100%)', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: '2.5rem' }}>
									{prod.badge && (
										<span style={{ position: 'absolute', top: '8px', left: '8px', background: prod.badge === 'Sale' ? '#d90429' : '#2ecc71', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{prod.badge}</span>
									)}
								</div>
								<div style={{ padding: '1rem' }}>
									<h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', fontSize: '14px' }}>{prod.name}</h3>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<span style={{ fontWeight: 700, color: 'var(--red)', fontSize: '15px' }}>{prod.price}</span>
										<span style={{ fontSize: '12px', color: 'var(--muted)' }}>{prod.rating}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</AppLayout>
	);
}
