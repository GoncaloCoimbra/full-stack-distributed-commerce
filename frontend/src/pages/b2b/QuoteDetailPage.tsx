import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AppLayout from '../../layouts/AppLayout';
import { apiClient } from '@/services/apiClient';

type QuoteDetails = {
	id: string;
	quoteNumber: string;
	companyName: string;
	contactName: string;
	email: string;
	phone?: string;
	category: string;
	quantity: number;
	description: string;
	status: string;
	priority: string;
	totalEstimate?: number;
	notes?: string;
	createdAt: string;
	updatedAt: string;
};

export default function QuoteDetailPage() {
	const { id } = useParams();
	const [quote, setQuote] = useState<QuoteDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const loadQuote = async () => {
			if (!id) return;
			setLoading(true);
			setError('');
			try {
				const res = await apiClient.get(`/b2b/quotes/${id}`);
				if (!res.success || !res.data) throw new Error(res.error?.message || 'Orçamento não encontrado.');
				const q = res.data.quote;
				setQuote({
					id: q._id || q.id,
					quoteNumber: q.quoteNumber,
					companyName: q.companyName,
					contactName: q.contactName,
					email: q.email,
					phone: q.phone,
					category: q.category,
					quantity: q.quantity,
					description: q.description,
					status: q.status,
					priority: q.priority,
					totalEstimate: q.totalEstimate,
					notes: q.notes,
					createdAt: q.createdAt,
					updatedAt: q.updatedAt
				});
			} catch (err: any) {
				setError(err?.message || 'Erro ao carregar o orçamento.');
			} finally {
				setLoading(false);
			}
		};

		loadQuote();
	}, [id]);

	return (
		<AppLayout>
			<Helmet>
				<title>Detalhe do Orçamento - Tranzor</title>
				<meta name="description" content="Veja os detalhes completos do seu orçamento B2B." />
			</Helmet>

			<section className="page-hero">
				<h1>Detalhe do Orçamento</h1>
				<p className="page-copy">Veja detalhes completos do orçamento solicitado à Tranzor.</p>
			</section>

			<section className="container" style={{ marginBottom: '4rem' }}>
				<Link to="/b2b/quotes" className="btn-link" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>← Voltar para a lista</Link>
				{loading ? (
					<div>Carregando orçamento...</div>
				) : error ? (
					<div className="alert alert-error">{error}</div>
				) : quote ? (
					<div className="page-panel">
						<div style={{ marginBottom: 24 }}>
							<h2>{quote.quoteNumber}</h2>
							<p style={{ margin: 0, color: 'var(--muted)' }}>Solicitado em {new Date(quote.createdAt).toLocaleDateString('pt-PT')}</p>
						</div>
						<div className="page-grid" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
							<div className="page-card">
								<strong>Empresa</strong>
								<p>{quote.companyName}</p>
							</div>
							<div className="page-card">
								<strong>Contato</strong>
								<p>{quote.contactName}</p>
								<p>{quote.email}</p>
								{quote.phone && <p>{quote.phone}</p>}
							</div>
							<div className="page-card">
								<strong>Status</strong>
								<p>{quote.status}</p>
							</div>
							<div className="page-card">
								<strong>Prioridade</strong>
								<p>{quote.priority}</p>
							</div>
						</div>

						<div className="page-panel" style={{ marginBottom: '1.5rem' }}>
							<h3>Detalhes do pedido</h3>
							<p><strong>Categoria:</strong> {quote.category}</p>
							<p><strong>Quantidade:</strong> {quote.quantity}</p>
							<p><strong>Descrição:</strong></p>
							<p>{quote.description}</p>
						</div>

						<div className="page-panel">
							<h3>Estimativa</h3>
							<p><strong>Valor estimado:</strong> {quote.totalEstimate ? `€${quote.totalEstimate.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}` : 'A definir'}</p>
							{quote.notes && (
								<div>
									<strong>Notas do vendedor:</strong>
									<p>{quote.notes}</p>
								</div>
							)}
						</div>
					</div>
				) : null}
			</section>
		</AppLayout>
	);
}
