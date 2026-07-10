import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function TicketDetailPage() {
	const [note, setNote] = useState('');
	const [history, setHistory] = useState([
		{ id: 1, author: 'Suporte', text: 'Ticket recebido e em análise.', time: '2024-01-15 09:20' },
		{ id: 2, author: 'Você', text: 'Obrigado. Preciso de atualização sobre o prazo.', time: '2024-01-15 09:45' },
		{ id: 3, author: 'Suporte', text: 'Estamos a verificar com logística. Resposta até o final do dia.', time: '2024-01-15 10:05' }
	]);

	const handleAddNote = (e: React.FormEvent) => {
		e.preventDefault();
		if (!note.trim()) return;
		setHistory(prev => [...prev, { id: prev.length + 1, author: 'Você', text: note.trim(), time: '2024-01-15 10:20' }]);
		setNote('');
	};

	return (
		<AppLayout
			title="Detalhe do Ticket"
			description="Veja o histórico completo e atualizações do seu ticket de suporte Tranzor."
			canonical="/support/ticket-detail"
		>
			<section className="page-hero" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
				<h1 style={{ color: 'white' }}>Detalhes do Ticket</h1>
				<p className="page-copy" style={{ color: 'rgba(255,255,255,0.9)' }}>
					Acompanhe o histórico do seu pedido de suporte e adicione atualizações imediatas.
				</p>
			</section>

			<section style={{ padding: '2rem 0' }}>
				<div className="container">
					<div style={{
						background: 'var(--charcoal-2)',
						borderRadius: '12px',
						border: '1px solid var(--border)',
						padding: '2rem',
						marginBottom: '2rem'
					}}>
						<div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
							<div>
								<span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Ticket</span>
								<h2 style={{ margin: '0.5rem 0 0 0' }}>TKT-2024-002</h2>
							</div>
							<div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
								<div style={{ padding: '1rem', background: 'var(--charcoal-3)', borderRadius: '10px' }}>
									<div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Status</div>
									<div style={{ fontWeight: 700, marginTop: '0.5rem' }}>Em Progresso</div>
								</div>
								<div style={{ padding: '1rem', background: 'var(--charcoal-3)', borderRadius: '10px' }}>
									<div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Categoria</div>
									<div style={{ fontWeight: 700, marginTop: '0.5rem' }}>Qualidade</div>
								</div>
								<div style={{ padding: '1rem', background: 'var(--charcoal-3)', borderRadius: '10px' }}>
									<div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Prioridade</div>
									<div style={{ fontWeight: 700, marginTop: '0.5rem', color: '#ef4444' }}>Alta</div>
								</div>
							</div>
						</div>
						<div style={{ marginBottom: '1.5rem' }}>
							<div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Resumo</div>
							<p style={{ margin: 0, lineHeight: 1.75 }}>O cliente reportou uma avaria no produto recebido. A equipe de logística está a verificar a disponibilidade de substituição e a planejar o envio para coleta do item danificado.</p>
						</div>
						<div style={{ display: 'grid', gap: '1rem' }}>
							{history.map(entry => (
								<div key={entry.id} style={{
									padding: '1rem',
									background: 'var(--charcoal-3)',
									borderRadius: '10px'
								}}>
									<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
										<div style={{ fontWeight: 700 }}>{entry.author}</div>
										<div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{entry.time}</div>
									</div>
									<p style={{ margin: 0, lineHeight: 1.7 }}>{entry.text}</p>
								</div>
							))}
						</div>
					</div>

					<form onSubmit={handleAddNote} style={{
						display: 'grid',
						gap: '1rem',
						background: 'var(--charcoal-2)',
						borderRadius: '12px',
						border: '1px solid var(--border)',
						padding: '2rem'
					}}>
						<div>
							<label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Adicionar nota rápida</label>
							<textarea
								value={note}
								onChange={(e) => setNote(e.target.value)}
								rows={4}
								placeholder="Escreva uma atualização ou pergunta..."
								style={{
									width: '100%',
									padding: '14px',
									borderRadius: '10px',
									border: '1px solid var(--border)',
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
								padding: '14px 24px',
								background: '#8b5cf6',
								color: 'white',
								border: 'none',
								borderRadius: '10px',
								fontWeight: 700,
								cursor: 'pointer'
							}}
						>
							Enviar Atualização
						</button>
					</form>
				</div>
			</section>
		</AppLayout>
	);
}
