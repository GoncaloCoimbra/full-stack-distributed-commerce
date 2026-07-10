import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function GiftCardPage() {
	const [selectedAmount, setSelectedAmount] = useState('25');
	const [recipientEmail, setRecipientEmail] = useState('');

	const denominations = [
		{ amount: '25', price: '€25.00', popular: false },
		{ amount: '50', price: '€50.00', popular: true },
		{ amount: '100', price: '€100.00', popular: false },
		{ amount: '250', price: '€250.00', popular: false },
	];

	const benefits = [
		{ icon: '🎁', title: 'Presente Perfeito', desc: 'Presente ideal para qualquer ocasião' },
		{ icon: '📈', title: 'Sem Data de Validade', desc: 'Use quando quiser, sem prazos' },
		{ icon: '📄', title: 'Fácil de Usar', desc: 'Aplique o código no checkout' },
		{ icon: '📧', title: 'Entrega Instantânea', desc: 'Receba por email em minutos' }
	];

	const handleSubmit = (e) => {
		e.preventDefault();
		alert(`Cartão presente de €${selectedAmount} enviado para ${recipientEmail}`);
	};

	return (
		<AppLayout
			title="Cartão Presente Tranzor"
			description="Oferea um cartão presente Tranzor para amigos e família. Sem data de validade, fácil de usar."
			canonical="/shop/gift-card"
		>
			<section className="page-hero" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }}>
				<h1 style={{ color: 'white' }}>Cartão Presente Tranzor</h1>
				<p className="page-copy" style={{ color: 'rgba(255,255,255,0.9)' }}>
					Oferea flexibilidade e prazer. Sem data de validade, válido para todos os produtos.
				</p>
			</section>

			<section style={{ padding: '2rem 0' }}>
				<div className="container">
					{/* Benefícios */}
					<h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Porqué escolher Cartão Presente Tranzor?</h2>
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
							<h3 style={{ margin: '0 0 1.5rem 0' }}>Adquirir Cartão Presente</h3>
							<form onSubmit={handleSubmit}>
								<div style={{ marginBottom: '1.5rem' }}>
									<label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>Selecione o Valor *</label>
									<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
										{denominations.map(denom => (
											<button
												key={denom.amount}
												type="button"
												onClick={() => setSelectedAmount(denom.amount)}
												style={{
													padding: '1rem',
													border: selectedAmount === denom.amount ? '2px solid #ec4899' : '1px solid var(--border)',
													background: 'var(--charcoal-3)',
													borderRadius: '6px',
													cursor: 'pointer',
													position: 'relative'
												}}
											>
												<div style={{ fontWeight: 600 }}>€{denom.amount}</div>
												{denom.popular && (
													<span style={{
														position: 'absolute',
														top: '-8px',
														right: '-8px',
														background: '#ef4444',
														color: 'white',
														padding: '0.25rem 0.5rem',
														borderRadius: '3px',
														fontSize: '0.7rem',
														fontWeight: 700
													}}
													>
														POPULAR
													</span>
												)}
											</button>
										))}
									</div>
								</div>
								<div style={{ marginBottom: '1.5rem' }}>
									<label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email do Destinatário *</label>
									<input
										type="email"
										required
										value={recipientEmail}
										onChange={(e) => setRecipientEmail(e.target.value)}
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
									type="submit"
									style={{
										width: '100%',
										padding: '14px',
										background: '#ec4899',
										color: 'white',
										border: 'none',
										borderRadius: '6px',
										fontSize: '1rem',
										fontWeight: 600,
										cursor: 'pointer'
									}}
								>
									Comprar e Enviar
								</button>
							</form>
						</div>

						{/* Info */}
						<div style={{
							background: 'var(--charcoal-2)',
							borderRadius: '12px',
							border: '1px solid var(--border)',
							padding: '2rem'
						}}>
							<h3 style={{ margin: '0 0 1.5rem 0' }}>Como Funciona?</h3>
							<ol style={{
								margin: 0,
								paddingLeft: '1.5rem',
								lineHeight: 2
							}}>
								<li>
									<strong>Selecione o valor</strong>
									<br />
									<span style={{ color: 'var(--muted)' }}>Escolha entre as opções disponíveis</span>
								</li>
								<li>
									<strong>Indique o email</strong>
									<br />
									<span style={{ color: 'var(--muted)' }}>De quem vai receber o presente</span>
								</li>
								<li>
									<strong>Processe o pagamento</strong>
									<br />
									<span style={{ color: 'var(--muted)' }}>Via cartão ou transferência</span>
								</li>
								<li>
									<strong>Email instantâneo</strong>
									<br />
									<span style={{ color: 'var(--muted)' }}>Seu presente chegará em minutos</span>
								</li>
							</ol>
						</div>
					</div>
				</div>
			</section>
		</AppLayout>
	);
}
