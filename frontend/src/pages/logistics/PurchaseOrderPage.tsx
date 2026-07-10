import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AppLayout from '../../layouts/AppLayout';

// Mock purchase orders data
const mockPurchaseOrders = [
	{
		id: 'PO-001',
		supplier: 'Papelaria Central',
		description: 'Cadernos A4 - 1000 unidades',
		total: 2500.00,
		status: 'Recebido',
		orderDate: '2026-04-15',
		deliveryDate: '2026-04-20',
		priority: 'Alta'
	},
	{
		id: 'PO-002',
		supplier: 'Escritório Plus',
		description: 'Canetas esferográficas - 500 unidades',
		total: 750.50,
		status: 'Em Trânsito',
		orderDate: '2026-04-18',
		deliveryDate: '2026-04-25',
		priority: 'Média'
	},
	{
		id: 'PO-003',
		supplier: 'Material Escolar Ltda',
		description: 'Borrachas e lápis - 2000 unidades',
		total: 1200.00,
		status: 'Pendente',
		orderDate: '2026-04-20',
		deliveryDate: '2026-04-28',
		priority: 'Alta'
	},
	{
		id: 'PO-004',
		supplier: 'Arte & Papel',
		description: 'Marcadores coloridos - 300 unidades',
		total: 450.75,
		status: 'Aprovado',
		orderDate: '2026-04-22',
		deliveryDate: '2026-04-30',
		priority: 'Baixa'
	},
	{
		id: 'PO-005',
		supplier: 'Distribuidora Nacional',
		description: 'Agendas 2026 - 500 unidades',
		total: 3750.00,
		status: 'Cancelado',
		orderDate: '2026-04-10',
		deliveryDate: '2026-04-18',
		priority: 'Média'
	},
];

const mockStats = {
	totalOrders: 47,
	activeOrders: 23,
	totalValue: 45250.75,
	overdueOrders: 2
};

export default function PurchaseOrderPage() {
	const [filterStatus, setFilterStatus] = useState('all');
	const [filterPriority, setFilterPriority] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');

	const filteredOrders = mockPurchaseOrders.filter(order => {
		const statusMatch = filterStatus === 'all' || order.status.toLowerCase().replace(' ', '-') === filterStatus;
		const priorityMatch = filterPriority === 'all' || order.priority.toLowerCase() === filterPriority;
		const searchMatch = searchTerm === '' ||
			order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.description.toLowerCase().includes(searchTerm.toLowerCase());
		return statusMatch && priorityMatch && searchMatch;
	});

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'recebido': return 'completed';
			case 'em trânsito': return 'in-transit';
			case 'aprovado': return 'approved';
			case 'pendente': return 'pending';
			case 'cancelado': return 'critical';
			default: return 'pending';
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority.toLowerCase()) {
			case 'alta': return 'high';
			case 'média': return 'medium';
			case 'baixa': return 'low';
			default: return 'medium';
		}
	};

	const isOverdue = (deliveryDate: string, status: string) => {
		if (status === 'Recebido' || status === 'Cancelado') return false;
		return new Date(deliveryDate) < new Date();
	};

	return (
		<AppLayout>
			<Helmet>
				<title>Encomendas de Compra - Tranzor</title>
				<meta name="description" content="Gere e acompanhe as encomendas de compra Tranzor." />
				<link rel="canonical" href="https://Tranzor.pt/logistics/purchase-orders" />
			</Helmet>

			<section className="page-hero">
				<h1>Encomendas de Compra</h1>
				<p className="page-copy">
					Gere e acompanhe as encomendas de compra Tranzor.
				</p>
			</section>

			<section className="container">
				{/* PO Stats */}
				<div className="page-grid" style={{ marginBottom: '3rem' }}>
					<div className="page-card">
						<h3 className="kpi-label">Total de Encomendas</h3>
						<div className="kpi-value">{mockStats.totalOrders}</div>
					</div>
					<div className="page-card">
						<h3 className="kpi-label">Encomendas Ativas</h3>
						<div className="kpi-value">{mockStats.activeOrders}</div>
					</div>
					<div className="page-card">
						<h3 className="kpi-label">Valor Total</h3>
						<div className="kpi-value">€{mockStats.totalValue.toLocaleString('pt-PT')}</div>
					</div>
					<div className="page-card">
						<h3 className="kpi-label">Encomendas Atrasadas</h3>
						<div className="kpi-value">{mockStats.overdueOrders}</div>
						{mockStats.overdueOrders > 0 && (
							<div className="kpi-change down" style={{ marginTop: '0.5rem' }}>
								Requer atenção
							</div>
						)}
					</div>
				</div>

				{/* Filters and Search */}
				<div className="page-panel" style={{ marginBottom: '2rem' }}>
					<div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
						<div className="form-group" style={{ marginBottom: 0 }}>
							<label htmlFor="search-input" className="form-label" style={{ display: 'block', marginBottom: '0.25rem' }}>
								Pesquisar:
							</label>
							<input
								type="text"
								id="search-input"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="form-input"
								placeholder="ID, fornecedor ou descrição..."
								style={{ minWidth: '250px' }}
							/>
						</div>

						<label htmlFor="status-filter">Status:</label>
						<select
							id="status-filter"
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="form-select"
						>
							<option value="all">Todos</option>
							<option value="aprovado">Aprovado</option>
							<option value="pendente">Pendente</option>
							<option value="em-trânsito">Em Trânsito</option>
							<option value="recebido">Recebido</option>
							<option value="cancelado">Cancelado</option>
						</select>

						<label htmlFor="priority-filter">Prioridade:</label>
						<select
							id="priority-filter"
							value={filterPriority}
							onChange={(e) => setFilterPriority(e.target.value)}
							className="form-select"
						>
							<option value="all">Todas</option>
							<option value="alta">Alta</option>
							<option value="média">Média</option>
							<option value="baixa">Baixa</option>
						</select>
					</div>
				</div>

				{/* Purchase Orders Table */}
				<div className="page-panel">
					<div className="table-responsive">
						<table className="data-table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Fornecedor</th>
									<th>Descrição</th>
									<th>Total</th>
									<th>Status</th>
									<th>Prioridade</th>
									<th>Data de Entrega</th>
									<th>Ações</th>
								</tr>
							</thead>
							<tbody>
								{filteredOrders.map((order) => (
									<tr key={order.id} className={isOverdue(order.deliveryDate, order.status) ? 'overdue-row' : ''}>
										<td>{order.id}</td>
										<td>{order.supplier}</td>
										<td>{order.description}</td>
										<td>€{order.total.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</td>
										<td>
											<span className={`status-badge status-${getStatusColor(order.status)}`}>
												{order.status}
												{isOverdue(order.deliveryDate, order.status) && (
													<span className="overdue-indicator" title="Atrasado">⚠️</span>
												)}
											</span>
										</td>
										<td>
											<span className={`priority-badge priority-${getPriorityColor(order.priority)}`}>
												{order.priority}
											</span>
										</td>
										<td>
											{new Date(order.deliveryDate).toLocaleDateString('pt-PT')}
											{isOverdue(order.deliveryDate, order.status) && (
												<span className="overdue-text"> (atrasado)</span>
											)}
										</td>
										<td>
											<div style={{ display: 'flex', gap: '0.5rem' }}>
												<button className="btn-link" aria-label={`Ver detalhes de ${order.id}`}>
													Ver
												</button>
												{order.status === 'Pendente' && (
													<button className="btn-link" aria-label={`Editar ${order.id}`}>
														Editar
													</button>
												)}
												{order.status === 'Em Trânsito' && (
													<button className="btn-link" aria-label={`Confirmar receção de ${order.id}`}>
														Receber
													</button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="page-panel" style={{ marginTop: '3rem', textAlign: 'center' }}>
					<h3>Ações Rápidas</h3>
					<div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
						<button className="btn-primary">Nova Encomenda</button>
						<button className="btn-secondary">Relatório de Fornecedores</button>
						<button className="btn-ghost">Gestão de Stock</button>
					</div>
				</div>
			</section>
		</AppLayout>
	);
}
