import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function TicketNewPage() {
	const [form, setForm] = useState({
		subject: '',
		category: 'Logística',
		priority: 'Média',
		description: ''
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		alert('Ticket criado com sucesso. A equipa entrará em contato em breve.');
		setForm({ subject: '', category: 'Logística', priority: 'Média', description: '' });
	};

	return (
		<AppLayout
			title="Criar Novo Ticket"
			description="Abra um novo pedido de suporte Tranzor e receba atendimento rápido."
			canonical="/support/tickets/new"
		>
			<section className="page-hero" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
				<h1 style={{ color: 'white' }}>Novo Ticket de Suporte</h1>
				<p className="page-copy" style={{ color: 'rgba(255,255,255,0.9)' }}>
					Abra um chamado e envie os detalhes do problema para nossa equipe.
				</p>
			</section>

			<section style={{ padding: '2rem 0' }}>
				<div className="container">
					<div style={{
						background: 'var(--charcoal-2)',
						borderRadius: '12px',
						border: '1px solid var(--border)',
						padding: '2rem',
						maxWidth: 760,
						margin: '0 auto'
					}}>
						<form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Assunto *</label>
								<input
									name="subject"
									type="text"
									required
									value={form.subject}
									onChange={handleChange}
									style={{
										width: '100%',
										padding: '14px',
										borderRadius: '10px',
										border: '1px solid var(--border)',
										background: 'var(--charcoal-3)',
										color: 'var(--text)',
										fontSize: '1rem'
									}}
								/>
							</div>
							<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
								<div>
									<label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Categoria</label>
									<select
										name="category"
										value={form.category}
										onChange={handleChange}
										style={{
											width: '100%',
											padding: '14px',
											borderRadius: '10px',
											border: '1px solid var(--border)',
											background: 'var(--charcoal-3)',
											color: 'var(--text)',
											fontSize: '1rem'
										}}
									>
										<option value="Logística">Logística</option>
										<option value="Financeiro">Financeiro</option>
										<option value="Qualidade">Qualidade</option>
										<option value="Acesso">Acesso</option>
									</select>
								</div>
								<div>
									<label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Prioridade</label>
									<select
										name="priority"
										value={form.priority}
										onChange={handleChange}
										style={{
											width: '100%',
											padding: '14px',
											borderRadius: '10px',
											border: '1px solid var(--border)',
											background: 'var(--charcoal-3)',
											color: 'var(--text)',
											fontSize: '1rem'
										}}
									>
										<option value="Baixa">Baixa</option>
										<option value="Média">Média</option>
										<option value="Alta">Alta</option>
										<option value="Crítica">Crítica</option>
									</select>
								</div>
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Descrição *</label>
								<textarea
									name="description"
									rows={6}
									value={form.description}
									onChange={handleChange}
									style={{
										width: '100%',
										padding: '14px',
										borderRadius: '10px',
										border: '1px solid var(--border)',
										background: 'var(--charcoal-3)',
										color: 'var(--text)',
										fontSize: '1rem',
										fontFamily: 'inherit'
										}}
								/>
							</div>
							<button
								type="submit"
								style={{
									padding: '14px 24px',
									background: '#f59e0b',
									color: 'white',
									border: 'none',
									borderRadius: '10px',
									fontWeight: 700,
									cursor: 'pointer'
								}}
							>
								Abrir Ticket
							</button>
						</form>
					</div>
				</div>
			</section>
		</AppLayout>
	);
}
