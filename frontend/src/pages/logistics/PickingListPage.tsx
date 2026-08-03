import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import './PickingListPage.css';

interface PickingItem {
	_id: string;
	sku: string;
	name: string;
	quantity: number;
	quantityPicked: number;
	location: string;
}

interface Picking {
	_id: string;
	pickingNumber: string;
	order: any;
	items: PickingItem[];
	status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
	priority: 'low' | 'normal' | 'high' | 'urgent';
	boxInfo: {
		boxType: string;
		weight: number;
		dimensions: { length: number; width: number; height: number };
	};
	startedAt?: Date;
	completedAt?: Date;
	estimatedTime: number;
	assignedTo?: string;
}

export default function PickingListPage() {
	const [filter, setFilter] = useState<'pending' | 'in_progress' | 'completed' | 'all'>('pending');
	const [selectedPicking, setSelectedPicking] = useState<Picking | null>(null);

	// Fetch picking list
	const { data: pickingsData, isLoading, refetch } = useQuery<any>({
		queryKey: ['pickings', filter],
		queryFn: async (): Promise<any> => {
			const response = await apiClient.get<any>('/wms/picking/list', {
				params: { status: filter === 'all' ? undefined : filter, limit: 50 },
			});
			return response.data;
		},
		refetchInterval: 5000, // Refresh every 5 seconds
	});

	// Fetch picking stats
	const { data: statsData } = useQuery<any>({
		queryKey: ['picking-stats'],
		queryFn: async (): Promise<any> => {
			const response = await apiClient.get<any>('/wms/picking/stats');
			return response.data;
		},
		refetchInterval: 10000,
	});

	// Start picking mutation
	const startPickingMutation = useMutation({
		mutationFn: async (pickingId: string) => {
			const response = await apiClient.post(`/wms/picking/${pickingId}/start`);
			return response.data;
		},
		onSuccess: () => {
			refetch();
		},
	});

	// Update item mutation
	const updateItemMutation = useMutation({
		mutationFn: async (data: { pickingId: string; itemIndex: number; quantityPicked: number }) => {
			const response = await apiClient.put(`/wms/picking/${data.pickingId}/item/${data.itemIndex}`, {
				quantityPicked: data.quantityPicked,
			});
			return response.data;
		},
		onSuccess: () => {
			refetch();
		},
	});

	// Complete picking mutation
	const completePickingMutation = useMutation({
		mutationFn: async (pickingId: string) => {
			const response = await apiClient.post(`/wms/picking/${pickingId}/complete`);
			return response.data;
		},
		onSuccess: () => {
			refetch();
			setSelectedPicking(null);
		},
	});

	const pickings = (pickingsData as any)?.data || [];
	const stats = (statsData as any)?.data;

	const getPriorityBadge = (priority: string) => {
		const badgeClass = {
			urgent: 'badge-urgent',
			high: 'badge-high',
			normal: 'badge-normal',
			low: 'badge-low',
		}[priority];
		return <span className={`badge ${badgeClass}`}>{priority.toUpperCase()}</span>;
	};

	const getStatusBadge = (status: string) => {
		const statusClass = {
			pending: 'status-pending',
			in_progress: 'status-in-progress',
			completed: 'status-completed',
			cancelled: 'status-cancelled',
		}[status];
		return <span className={`status ${statusClass}`}>{status.replace('_', ' ').toUpperCase()}</span>;
	};

	const calculateProgress = (items: PickingItem[]): number => {
		if (items.length === 0) return 0;
		const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
		const pickedQty = items.reduce((sum, item) => sum + item.quantityPicked, 0);
		return Math.round((pickedQty / totalQty) * 100);
	};

	return (
		<AppLayout>
			<section className="page-hero">
				<h1>🎯 Gestão de Picking</h1>
				<p className="page-copy">Acompanhe e gerencie a separação de pedidos em tempo real</p>
			</section>

			{/* Stats Overview */}
			{stats && (
				<section className="container picking-stats">
					<div className="stat-card">
						<h3>{stats.pending}</h3>
						<p>Pendentes</p>
					</div>
					<div className="stat-card">
						<h3>{stats.inProgress}</h3>
						<p>Em Progresso</p>
					</div>
					<div className="stat-card">
						<h3>{stats.completed}</h3>
						<p>Completados</p>
					</div>
					<div className="stat-card">
						<h3>{stats.averagePickingTime?.toFixed(1)}m</h3>
						<p>Tempo Médio</p>
					</div>
				</section>
			)}

			{/* Filter Tabs */}
			<section className="container picking-filters">
				{(['pending', 'in_progress', 'completed', 'all'] as const).map((status) => (
					<button
						key={status}
						className={`filter-btn ${filter === status ? 'active' : ''}`}
						onClick={() => setFilter(status)}
					>
						{status.replace('_', ' ').toUpperCase()}
					</button>
				))}
			</section>

			{/* Picking List */}
			<section className="container page-panel picking-list">
				{isLoading ? (
					<p>Carregando...</p>
				) : pickings.length === 0 ? (
					<p>Nenhum picking encontrado</p>
				) : (
					<table className="picking-table">
						<thead>
							<tr>
								<th>Picking</th>
								<th>Ordem</th>
								<th>Caixa</th>
								<th>Progresso</th>
								<th>Prioridade</th>
								<th>Status</th>
								<th>Ações</th>
							</tr>
						</thead>
						<tbody>
							{pickings.map((picking: Picking) => {
								const progress = calculateProgress(picking.items);
								return (
									<tr key={picking._id}>
										<td className="picking-number">
											<strong>{picking.pickingNumber}</strong>
										</td>
										<td>{picking.order?.orderNumber || '-'}</td>
										<td>{picking.boxInfo.boxType}</td>
										<td>
											<div className="progress-bar">
												<div className="progress-fill" style={{ width: `${progress}%` }}>
													{progress}%
												</div>
											</div>
										</td>
										<td>{getPriorityBadge(picking.priority)}</td>
										<td>{getStatusBadge(picking.status)}</td>
										<td className="actions">
											{picking.status === 'pending' && (
												<button
													className="btn-sm btn-primary"
													onClick={() => startPickingMutation.mutate(picking._id)}
													disabled={startPickingMutation.isPending}
												>
													Iniciar
												</button>
											)}
											<button
												className="btn-sm btn-secondary"
												onClick={() => setSelectedPicking(picking)}
											>
												Detalhes
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</section>

			{/* Picking Details Modal */}
			{selectedPicking && (
				<div className="modal-overlay" onClick={() => setSelectedPicking(null)}>
					<div className="modal-content picking-modal" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h2>{selectedPicking.pickingNumber}</h2>
							<button className="btn-close" onClick={() => setSelectedPicking(null)}>
								✕
							</button>
						</div>

						<div className="modal-body">
							{/* Box Info */}
							<div className="box-info">
								<h3>📦 Informações da Caixa</h3>
								<div className="info-grid">
									<div>
										<strong>Tipo:</strong> {selectedPicking.boxInfo.boxType}
									</div>
									<div>
										<strong>Peso:</strong> {selectedPicking.boxInfo.weight.toFixed(2)} kg
									</div>
									<div>
										<strong>Dimensões:</strong>{' '}
										{selectedPicking.boxInfo.dimensions.length}x{selectedPicking.boxInfo.dimensions.width}x
										{selectedPicking.boxInfo.dimensions.height} cm
									</div>
									<div>
										<strong>Status:</strong> {getStatusBadge(selectedPicking.status)}
									</div>
								</div>
							</div>

							{/* Items Checklist */}
							<div className="items-checklist">
								<h3>📋 Items para Separar</h3>
								<div className="items-list">
									{selectedPicking.items.map((item, index) => (
										<div key={item._id} className="item-row">
											<div className="item-info">
												<strong>{item.sku}</strong>
												<p>{item.name}</p>
												<small>Localização: {item.location}</small>
											</div>

											<div className="item-quantity">
												<div className="qty-label">
													{item.quantityPicked}/{item.quantity}
												</div>
											</div>

											{selectedPicking.status === 'in_progress' && (
												<div className="item-actions">
													<input
														type="number"
														min="0"
														max={item.quantity}
														defaultValue={item.quantityPicked}
														onBlur={(e) => {
															const qty = parseInt(e.target.value);
															if (qty !== item.quantityPicked && qty >= 0 && qty <= item.quantity) {
																updateItemMutation.mutate({
																	pickingId: selectedPicking._id,
																	itemIndex: index,
																	quantityPicked: qty,
																});
															}
														}}
													/>
												</div>
											)}
										</div>
									))}
								</div>
							</div>

							{/* Action Buttons */}
							<div className="modal-actions">
								{selectedPicking.status === 'pending' && (
									<button
										className="btn btn-primary"
										onClick={() => startPickingMutation.mutate(selectedPicking._id)}
										disabled={startPickingMutation.isPending}
									>
										Iniciar Picking
									</button>
								)}

								{selectedPicking.status === 'in_progress' && (
									<button
										className="btn btn-success"
										onClick={() => completePickingMutation.mutate(selectedPicking._id)}
										disabled={completePickingMutation.isPending}
									>
										Completar Picking
									</button>
								)}

								<button className="btn btn-secondary" onClick={() => setSelectedPicking(null)}>
									Fechar
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</AppLayout>
	);
}

