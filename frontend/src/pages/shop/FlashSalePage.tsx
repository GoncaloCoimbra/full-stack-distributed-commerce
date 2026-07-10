import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function FlashSalePage() {
	const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
				if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
				if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
				return prev;
			});
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const flashProducts = [
		{ id: 1, name: 'Papel A4 Branco (Resma)', original: '€8.99', sale: '€3.99', discount: '56%', stock: 45, image: '📄' },
		{ id: 2, name: 'Caneta Azul Ballpoint (Caixa)', original: '€12.50', sale: '€4.99', discount: '60%', stock: 120, image: '🖊️' },
		{ id: 3, name: 'Caderno A4 200pg', original: '€6.99', sale: '€2.49', discount: '64%', stock: 89, image: '📓' },
		{ id: 4, name: 'Pasta Arquivo (Pack 5)', original: '€14.99', sale: '€5.99', discount: '60%', stock: 34, image: '📁' },
		{ id: 5, name: 'Lápis de Cor 24 Cores', original: '€19.99', sale: '€7.99', discount: '60%', stock: 12, image: '🎨' },
		{ id: 6, name: 'Marcadores Permanentes', original: '€15.99', sale: '€5.49', discount: '66%', stock: 200, image: '🖨️' },
		{ id: 7, name: 'Clips Metálicos (500)', original: '€8.99', sale: '€2.99', discount: '67%', stock: 567, image: '📎' },
		{ id: 8, name: 'Tinta de Impressora', original: '€39.99', sale: '€15.99', discount: '60%', stock: 6, image: '🖨️' },
	];

	return (
		<AppLayout
			title="Promoção Relâmpago"
			description="Aproveite descontos exclusivos e limitados por tempo. Ofertas de até 60% em produtos selecionados Tranzor."
			canonical="/shop/flash-sale"
		>
			<section className="page-hero" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}>
				<h1 style={{ color: 'white' }}>Promoção Relâmpago</h1>
				<p className="page-copy" style={{ color: 'rgba(255,255,255,0.9)' }}>
					Descontos exclusivos por tempo limitado. Não perca esta oportunidade!
				</p>
			</section>

			{/* Timer */}
			<section style={{
				padding: '2rem 0',
				background: 'linear-gradient(135deg, rgba(220,38,38,0.1) 0%, rgba(153,27,27,0.1) 100%)'
			}}>
				<div className="container">
					<div style={{
						background: 'var(--charcoal-2)',
						borderRadius: '12px',
						border: '2px solid #dc2626',
						padding: '2rem',
						textAlign: 'center'
					}}>
						<h2 style={{ margin: '0 0 1.5rem 0', color: '#dc2626' }}>Aproveita Enquanto Dura!</h2>
						<div style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
							gap: '1rem',
							marginBottom: '1.5rem'
						}}>
							{[
								{ label: 'Horas', value: String(timeLeft.hours).padStart(2, '0') },
								{ label: 'Minutos', value: String(timeLeft.minutes).padStart(2, '0') },
								{ label: 'Segundos', value: String(timeLeft.seconds).padStart(2, '0') }
							].map((time) => (
								<div key={time.label}>
									<div style={{
										fontSize: '2.5rem',
										fontWeight: 700,
										color: '#dc2626',
										marginBottom: '0.5rem'
									}}
									>
										{time.value}
									</div>
									<div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{time.label}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Produtos */}
			<section style={{ padding: '2rem 0' }}>
				<div className="container">
					<h2 style={{ marginBottom: '2rem' }}>Produtos em Desconto</h2>
					<div className="page-grid page-grid-4" style={{ marginBottom: '3rem' }}>
						{flashProducts.map((product) => (
							<div key={product.id} className="page-card" style={{
								display: 'flex',
								flexDirection: 'column',
								padding: '1.5rem',
								position: 'relative'
							}}>
								<div style={{
									position: 'absolute',
									top: '1rem',
									right: '1rem',
									background: '#dc2626',
									color: 'white',
									padding: '0.5rem 0.75rem',
									borderRadius: '6px',
									fontSize: '0.85rem',
									fontWeight: 700
								}}
								>
									-{product.discount}
								</div>
								<div style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center', marginTop: '0.5rem' }}>{product.image}</div>
								<h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', lineHeight: 1.3 }}>{product.name}</h3>
								<div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
									<div style={{
										fontSize: '0.85rem',
										color: 'var(--muted)',
										textDecoration: 'line-through'
									}}
									>
										{product.original}
									</div>
									<div style={{
										fontSize: '1.5rem',
										fontWeight: 700,
										color: '#dc2626'
									}}
									>
										{product.sale}
									</div>
								</div>
								<div style={{
									fontSize: '0.85rem',
									color: 'var(--muted)',
									marginBottom: '1rem',
									marginTop: 'auto'
								}}
								>
									{product.stock} un. em stock
								</div>
								<button
									style={{
										width: '100%',
										padding: '10px',
										background: '#dc2626',
										color: 'white',
										border: 'none',
										borderRadius: '6px',
										fontSize: '0.9rem',
										fontWeight: 600,
										cursor: 'pointer'
									}}
								>
									Adicionar ao Carrinho
								</button>
							</div>
						))}
					</div>
				</div>
			</section>
		</AppLayout>
	);
}
