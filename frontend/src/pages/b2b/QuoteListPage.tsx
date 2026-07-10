import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import { apiClient } from '@/services/apiClient';

type QuoteItem = {
id: string;
quoteNumber: string;
companyName: string;
contactName: string;
email: string;
category: string;
quantity: number;
description: string;
status: string;
priority: string;
createdAt: string;
updatedAt: string;
validUntil?: string;
totalEstimate?: number;
};

const statusMap: Record<string, string> = {
pending: 'pending',
approved: 'completed',
review: 'awaiting',
rejected: 'critical',
expired: 'expired'
};

const priorityMap: Record<string, string> = {
high: 'high',
medium: 'medium',
low: 'low'
};

const heroStats = [
{ label: 'Orçamentos ativos', value: '12' },
{ label: 'Tempo médio de resposta', value: '24h' },
{ label: 'Canal prioritário', value: 'E-mail + WhatsApp' }
];

export default function QuoteListPage() {
const [quotes, setQuotes] = useState<QuoteItem[]>([]);
const [stats, setStats] = useState({ totalQuotes: 0, activeQuotes: 0, approvedQuotes: 0, totalValue: 0 });
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [filterStatus, setFilterStatus] = useState('all');
const [filterPriority, setFilterPriority] = useState('all');
const [sortBy, setSortBy] = useState('createdAt');

const loadQuotes = async () => {
setLoading(true);
setError('');
try {
const params: Record<string, string> = { page: String(page), limit: '20' };
if (filterStatus !== 'all') params.status = filterStatus;
if (filterPriority !== 'all') params.priority = filterPriority;
const queryString = new URLSearchParams(params).toString();
const res = await apiClient.get(`/b2b/quotes?${queryString}`);
if (!res.success || !res.data) throw new Error(res.error?.message || 'Erro ao carregar orçamentos.');
const loaded = (res.data.quotes || []).map((quote: any) => ({
id: quote._id || quote.id,
quoteNumber: quote.quoteNumber || quote.id || 'N/A',
companyName: quote.companyName,
contactName: quote.contactName,
email: quote.email,
category: quote.category,
quantity: quote.quantity,
description: quote.description,
status: quote.status,
priority: quote.priority,
createdAt: quote.createdAt,
updatedAt: quote.updatedAt,
validUntil: quote.validUntil || quote.updatedAt,
totalEstimate: quote.totalEstimate
}));
setQuotes(loaded);
setTotalPages(res.data.pagination?.totalPages || 1);
setStats({
totalQuotes: res.data.pagination?.totalQuotes || loaded.length,
activeQuotes: loaded.filter(q => !['rejected', 'expired'].includes(q.status.toLowerCase())).length,
approvedQuotes: loaded.filter(q => q.status.toLowerCase() === 'approved').length,
totalValue: loaded.reduce((sum, quote) => sum + (quote.totalEstimate || 0), 0)
});
} catch (err: any) {
setError(err?.message || 'Erro desconhecido');
} finally {
setLoading(false);
}
};

useEffect(() => {
loadQuotes();
}, [page, filterStatus, filterPriority]);

const sortedQuotes = useMemo(() => {
return [...quotes].sort((a, b) => {
if (sortBy === 'createdAt') {
return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}
if (sortBy === 'totalEstimate') {
return (b.totalEstimate || 0) - (a.totalEstimate || 0);
}
if (sortBy === 'validUntil') {
return new Date(a.validUntil || a.createdAt).getTime() - new Date(b.validUntil || b.createdAt).getTime();
}
return 0;
});
}, [quotes, sortBy]);

return (
<AppLayout>
<Helmet>
<title>Lista de Orçamentos - Tranzor</title>
<meta name="description" content="Consulte todos os orçamentos solicitados à Tranzor." />
<link rel="canonical" href="https://Tranzor.pt/b2b/quotes" />
</Helmet>

<section className="page-hero" style={{ borderRadius: '24px', marginBottom: '2rem' }}>
<p className="section-label">Gestão B2B</p>
<h1>Lista de Orçamentos</h1>
<p className="page-copy" style={{ maxWidth: 720 }}>
Acompanhe pedidos de orçamento, aprovados ou em análise, e mantenha o time comercial alinhado com cada etapa.
</p>
<div className="page-grid page-grid-3" style={{ marginTop: '1.5rem' }}>
{heroStats.map((stat) => (
<article key={stat.label} className="page-card" style={{ padding: '1.1rem 1.25rem' }}>
<p className="section-label" style={{ marginBottom: '0.6rem' }}>{stat.label}</p>
<div className="kpi-value">{stat.value}</div>
</article>
))}
</div>
</section>

<section className="container">
{error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}
<div className="page-grid" style={{ marginBottom: '2rem' }}>
<div className="page-card">
<h3 className="kpi-label">Total de Orçamentos</h3>
<div className="kpi-value">{stats.totalQuotes}</div>
</div>
<div className="page-card">
<h3 className="kpi-label">Orçamentos Ativos</h3>
<div className="kpi-value">{stats.activeQuotes}</div>
</div>
<div className="page-card">
<h3 className="kpi-label">Valor Estimado</h3>
<div className="kpi-value">€{stats.totalValue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</div>
</div>
<div className="page-card">
<h3 className="kpi-label">Taxa de Aprovação</h3>
<div className="kpi-value">{stats.totalQuotes ? Math.round((stats.approvedQuotes / stats.totalQuotes) * 100) : 0}%</div>
</div>
</div>

<div className="page-panel" style={{ marginBottom: '2rem' }}>
<div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
<label htmlFor="status-filter">Status:</label>
<select
id="status-filter"
value={filterStatus}
onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
className="form-select"
>
<option value="all">Todos</option>
<option value="pending">Pendente</option>
<option value="approved">Aprovado</option>
<option value="review">Em revisão</option>
<option value="rejected">Rejeitado</option>
<option value="expired">Expirado</option>
</select>

<label htmlFor="priority-filter">Prioridade:</label>
<select
id="priority-filter"
value={filterPriority}
onChange={(e) => { setFilterPriority(e.target.value); setPage(1); }}
className="form-select"
>
<option value="all">Todas</option>
<option value="high">Alta</option>
<option value="medium">Média</option>
<option value="low">Baixa</option>
</select>

<label htmlFor="sort-select">Ordenar por:</label>
<select
id="sort-select"
value={sortBy}
onChange={(e) => setSortBy(e.target.value)}
className="form-select"
>
<option value="createdAt">Data de Criação</option>
<option value="totalEstimate">Valor Estimado</option>
<option value="validUntil">Data de Validade</option>
</select>
</div>
</div>

<div className="page-panel">
<div className="table-responsive">
<table className="data-table">
<thead>
<tr>
<th>Orçamento</th>
<th>Empresa</th>
<th>Categoria</th>
<th>Status</th>
<th>Prioridade</th>
<th>Valor</th>
<th>Data</th>
<th>Ações</th>
</tr>
</thead>
<tbody>
{loading ? (
<tr>
<td colSpan={8} style={{ textAlign: 'center', padding: '2rem 1rem' }}>Carregando orçamentos...</td>
</tr>
) : sortedQuotes.length === 0 ? (
<tr>
<td colSpan={8} style={{ textAlign: 'center', padding: '2rem 1rem' }}>Nenhum orçamento encontrado.</td>
</tr>
) : (
sortedQuotes.map((quote) => (
<tr key={quote.id}>
<td>{quote.quoteNumber}</td>
<td>{quote.companyName}</td>
<td>{quote.category}</td>
<td><span className={`status-badge status-${statusMap[quote.status.toLowerCase()] || 'pending'}`}>{quote.status}</span></td>
<td><span className={`priority-badge priority-${priorityMap[quote.priority.toLowerCase()] || 'medium'}`}>{quote.priority}</span></td>
<td>€{(quote.totalEstimate || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</td>
<td>{new Date(quote.createdAt).toLocaleDateString('pt-PT')}</td>
<td>
<Link to={`/b2b/quote/${quote.id}`} className="btn-link">Ver</Link>
</td>
</tr>
))
)}
</tbody>
</table>
</div>
</div>

<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
<div>Página {page} de {totalPages}</div>
<div style={{ display: 'flex', gap: 8 }}>
<button className="btn-secondary" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Anterior</button>
<button className="btn-secondary" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Seguinte</button>
</div>
</div>
</section>
</AppLayout>
);
}
