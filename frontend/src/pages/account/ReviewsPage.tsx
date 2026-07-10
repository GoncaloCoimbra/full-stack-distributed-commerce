import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AppLayout from '../../layouts/AppLayout';

// Mock reviews data
const mockReviews = [
	{
		id: 'REV-001',
		product: 'Caderno Executivo Premium',
		rating: 5,
		comment: 'Produto excelente, qualidade superior. Recomendo!',
		date: '2026-05-03',
		status: 'Publicado',
		helpful: 12
	},
	{
		id: 'REV-002',
		product: 'Caneta Esferográfica Azul',
		rating: 4,
		comment: 'Boa qualidade, entrega rápida. Poderia ter mais opções de cores.',
		date: '2026-05-01',
		status: 'Publicado',
		helpful: 8
	},
	{
		id: 'REV-003',
		product: 'Agenda 2026',
		rating: 3,
		comment: 'Produto ok, mas o preço está um pouco elevado.',
		date: '2026-04-28',
		status: 'Em Moderação',
		helpful: 3
	},
	{
		id: 'REV-004',
		product: 'Marcadores Coloridos',
		rating: 5,
		comment: 'Perfeitos para o trabalho escolar. Cores vibrantes!',
		date: '2026-04-25',
		status: 'Publicado',
		helpful: 15
	},
];

const mockStats = {
	totalReviews: 47,
	averageRating: 4.2,
	fiveStars: 28,
	fourStars: 12,
	threeStars: 4,
	twoStars: 2,
	oneStar: 1
};

export default function ReviewsPage() {
	const [filterRating, setFilterRating] = useState('all');
	const [filterStatus, setFilterStatus] = useState('all');

	const filteredReviews = mockReviews.filter(review => {
		const ratingMatch = filterRating === 'all' || review.rating.toString() === filterRating;
		const statusMatch = filterStatus === 'all' || review.status.toLowerCase().replace(' ', '-') === filterStatus;
		return ratingMatch && statusMatch;
	});

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<svg
				key={i}
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill={i < rating ? "var(--red)" : "var(--border)"}
				aria-hidden
			>
				<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
			</svg>
		));
	};

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'publicado': return 'completed';
			case 'em moderação': return 'pending';
			default: return 'pending';
		}
	};

	return (
		<AppLayout>
			<Helmet>
				<title>Minhas Avaliações - Tranzor</title>
				<meta name="description" content="Consulte e gere as avaliações dos seus produtos Tranzor." />
				<link rel="canonical" href="https://Tranzor.pt/account/reviews" />
			</Helmet>

			<section className="page-hero">
				<h1>Minhas Avaliações</h1>
				<p className="page-copy">
					Consulte e gere as avaliações dos seus produtos Tranzor.
				</p>
			</section>

			<section className="container">
				{/* Review Stats */}
				<div className="page-grid" style={{ marginBottom: '3rem' }}>
					<div className="page-card">
						<h3 className="kpi-label">Total de Avaliações</h3>
						<div className="kpi-value">{mockStats.totalReviews}</div>
					</div>
					<div className="page-card">
						<h3 className="kpi-label">Avaliação Média</h3>
						<div className="kpi-value">{mockStats.averageRating}</div>
						<div style={{ display: 'flex', gap: '2px', marginTop: '0.5rem' }}>
							{renderStars(Math.round(mockStats.averageRating))}
						</div>
					</div>
					<div className="page-card">
						<h3 className="kpi-label">Distribuição</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
							<div>5★: {mockStats.fiveStars} ({Math.round((mockStats.fiveStars/mockStats.totalReviews)*100)}%)</div>
							<div>4★: {mockStats.fourStars} ({Math.round((mockStats.fourStars/mockStats.totalReviews)*100)}%)</div>
							<div>3★: {mockStats.threeStars} ({Math.round((mockStats.threeStars/mockStats.totalReviews)*100)}%)</div>
						</div>
					</div>
				</div>

				{/* Filters */}
				<div className="page-panel" style={{ marginBottom: '2rem' }}>
					<div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
						<label htmlFor="rating-filter">Classificação:</label>
						<select
							id="rating-filter"
							value={filterRating}
							onChange={(e) => setFilterRating(e.target.value)}
							className="form-select"
						>
							<option value="all">Todas</option>
							<option value="5">5 Estrelas</option>
							<option value="4">4 Estrelas</option>
							<option value="3">3 Estrelas</option>
							<option value="2">2 Estrelas</option>
							<option value="1">1 Estrela</option>
						</select>

						<label htmlFor="status-filter">Status:</label>
						<select
							id="status-filter"
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="form-select"
						>
							<option value="all">Todos</option>
							<option value="publicado">Publicado</option>
							<option value="em-moderação">Em Moderação</option>
						</select>
					</div>
				</div>

				{/* Reviews List */}
				<div className="reviews-list">
					{filteredReviews.map((review) => (
						<div key={review.id} className="review-card">
							<div className="review-header">
								<div className="review-product">
									<h3>{review.product}</h3>
									<div className="review-stars">
										{renderStars(review.rating)}
										<span className="review-rating-text">{review.rating}/5</span>
									</div>
								</div>
								<div className="review-meta">
									<span className={`status-badge status-${getStatusColor(review.status)}`}>
										{review.status}
									</span>
									<span className="review-date">
										{new Date(review.date).toLocaleDateString('pt-PT')}
									</span>
								</div>
							</div>

							<div className="review-content">
								<p>{review.comment}</p>
							</div>

							<div className="review-footer">
								<span className="review-helpful">
									{review.helpful} pessoas acharam útil
								</span>
								<div className="review-actions">
									<button className="btn-link">Editar</button>
									<button className="btn-link">Eliminar</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Write New Review */}
				<div className="page-panel" style={{ marginTop: '3rem', textAlign: 'center' }}>
					<h3>Escrever Nova Avaliação</h3>
					<p>Partilhe a sua experiência com os produtos Tranzor.</p>
					<button className="btn-primary" style={{ marginTop: '1rem' }}>
						Escrever Avaliação
					</button>
				</div>
			</section>
		</AppLayout>
	);
}
