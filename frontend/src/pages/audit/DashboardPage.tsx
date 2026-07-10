import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AppLayout from '../../layouts/AppLayout';

// Mock audit data
const mockAuditKPIs = [
	{ label: 'Auditorias Ativas', value: '12', change: '+2', trend: 'up' },
	{ label: 'Alertas Críticos', value: '3', change: '-1', trend: 'down' },
	{ label: 'Compliance Score', value: '98%', change: '+0.5%', trend: 'up' },
	{ label: 'Auditorias Concluídas', value: '247', change: '+15', trend: 'up' },
];

const mockRecentAudits = [
	{ id: 'AUD-001', type: 'Segurança', status: 'Em Andamento', priority: 'Alta', progress: 75, lastUpdate: '2026-05-03' },
	{ id: 'AUD-002', type: 'Qualidade', status: 'Concluída', priority: 'Média', progress: 100, lastUpdate: '2026-05-02' },
	{ id: 'AUD-003', type: 'Financeira', status: 'Pendente', priority: 'Alta', progress: 0, lastUpdate: '2026-05-01' },
	{ id: 'AUD-004', type: 'Operacional', status: 'Em Revisão', priority: 'Baixa', progress: 90, lastUpdate: '2026-04-30' },
];

const mockAlerts = [
	{ level: 'critical', message: 'Violação de segurança detectada no sistema de pagamentos', time: '2h atrás' },
	{ level: 'warning', message: 'Auditoria de qualidade atrasada em 3 dias', time: '5h atrás' },
	{ level: 'info', message: 'Nova política de compliance implementada', time: '1d atrás' },
];

export default function DashboardPage() {
	const [filterStatus, setFilterStatus] = useState('all');

	const filteredAudits = mockRecentAudits.filter(audit => {
		if (filterStatus === 'all') return true;
		return audit.status.toLowerCase().replace(' ', '-') === filterStatus;
	});

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'concluída': return 'completed';
			case 'em andamento': return 'active';
			case 'pendente': return 'pending';
			case 'em revisão': return 'awaiting';
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

	return (
		<AppLayout>
			<Helmet>
				<title>Dashboard de Auditoria - Tranzor</title>
				<meta name="description" content="Acompanhe o desempenho e histórico das auditorias Tranzor." />
				<link rel="canonical" href="https://Tranzor.pt/audit/dashboard" />
			</Helmet>

			<section className="page-hero">
				<h1>Dashboard de Auditoria</h1>
				<p className="page-copy">
					Acompanhe o desempenho e histórico das auditorias Tranzor.
				</p>
			</section>

			<section className="container">
				{/* Audit KPIs */}
				<div className="page-grid" style={{ marginBottom: '3rem' }}>
					{mockAuditKPIs.map((kpi, index) => (
						<div key={index} className="page-card">
							<h3 className="kpi-label">{kpi.label}</h3>
							<div className="kpi-value">{kpi.value}</div>
							<div className={`kpi-change ${kpi.trend}`}>
								{kpi.change}
								<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
									<path d={kpi.trend === 'up' ? "M6 3L9 6H3L6 3Z" : "M6 9L3 6H9L6 9Z"} fill="currentColor" />
								</svg>
							</div>
						</div>
					))}
				</div>

				{/* System Alerts */}
				<div className="page-panel" style={{ marginBottom: '3rem' }}>
					<h2>Alertas do Sistema</h2>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
						{mockAlerts.map((alert, index) => (
							<div key={index} className={`alert alert-${alert.level}`}>
								<span className="alert-icon" aria-hidden>
									{alert.level === 'critical' && '🚨'}
									{alert.level === 'warning' && '⚠️'}
									{alert.level === 'info' && 'ℹ️'}
								</span>
								<span>{alert.message}</span>
								<span className="alert-time">{alert.time}</span>
							</div>
						))}
					</div>
				</div>

				{/* Recent Audits */}
				<div className="page-panel">
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
						<h2>Auditorias Recentes</h2>
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="form-select"
							aria-label="Filtrar por status"
						>
							<option value="all">Todas</option>
							<option value="em-andamento">Em Andamento</option>
							<option value="concluída">Concluída</option>
							<option value="pendente">Pendente</option>
							<option value="em-revisão">Em Revisão</option>
						</select>
					</div>

					<div className="table-responsive">
						<table className="data-table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Tipo</th>
									<th>Status</th>
									<th>Prioridade</th>
									<th>Progresso</th>
									<th>Última Atualização</th>
									<th>Ações</th>
								</tr>
							</thead>
							<tbody>
								{filteredAudits.map((audit) => (
									<tr key={audit.id}>
										<td>{audit.id}</td>
										<td>{audit.type}</td>
										<td>
											<span className={`status-badge status-${getStatusColor(audit.status)}`}>
												{audit.status}
											</span>
										</td>
										<td>
											<span className={`priority-badge priority-${getPriorityColor(audit.priority)}`}>
												{audit.priority}
											</span>
										</td>
										<td>
											<div className="progress-bar">
												<div
													className="progress-fill"
													style={{ width: `${audit.progress}%` }}
												></div>
												<span className="progress-text">{audit.progress}%</span>
											</div>
										</td>
										<td>{new Date(audit.lastUpdate).toLocaleDateString('pt-PT')}</td>
										<td>
											<button className="btn-link" aria-label={`Ver detalhes de ${audit.id}`}>
												Ver
											</button>
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
						<button className="btn-primary">Nova Auditoria</button>
						<button className="btn-secondary">Relatório Mensal</button>
						<button className="btn-ghost">Configurações</button>
					</div>
				</div>
			</section>
		</AppLayout>
	);
}
