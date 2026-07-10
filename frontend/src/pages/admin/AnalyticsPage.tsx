import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AppLayout from '../../layouts/AppLayout';
import { apiClient } from '../../services/apiClient';

interface TrendPoint {
  label: string;
  views: number;
  checkouts: number;
}

interface TopProduct {
  id: string;
  name: string;
  views: number;
  adds: number;
  revenue: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

interface AttributionMetric {
  source: string;
  conversions: number;
  percentage: number;
}

interface FunnelStage {
  name: string;
  count: number;
  conversionRate: number;
  dropoff: number;
}

interface Insight {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

interface AnalyticsOverview {
  totalEvents: number;
  uniqueSessions: number;
  pageViews: number;
  cartAdds: number;
  checkoutStarted: number;
  checkoutCompleted: number;
  conversionRate: number;
}

interface AnalyticsSummary {
  overview: AnalyticsOverview;
  trend: TrendPoint[];
  topProducts: TopProduct[];
  trafficSources: TrafficSource[];
  attribution: {
    firstTouch: AttributionMetric[];
    lastTouch: AttributionMetric[];
    assisted: AttributionMetric[];
  };
  funnel: {
    stages: FunnelStage[];
    overallConversionRate: number;
  };
  insights: Insight[];
  availableFilters: {
    channels: string[];
    categories: string[];
    products: Array<{
      id: string;
      name: string;
    }>;
  };
}

interface AnalyticsFilters {
  period: '7d' | '30d' | '90d' | '12m' | 'all';
  channel: string;
  category: string;
  product: string;
}

type PeriodOption = AnalyticsFilters['period'];
type AttributionModel = keyof AnalyticsSummary['attribution'];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);

const periodOptions: Array<{ value: PeriodOption; label: string }> = [
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
  { value: '12m', label: 'Último ano' },
  { value: 'all', label: 'Tudo' },
];

function getPeriodRange(period: PeriodOption) {
  const endDate = new Date();
  const startDate = new Date(endDate);

  switch (period) {
    case '7d':
      startDate.setDate(endDate.getDate() - 6);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 29);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 89);
      break;
    case '12m':
      startDate.setMonth(endDate.getMonth() - 11);
      break;
    case 'all':
      startDate.setFullYear(2000);
      break;
    default:
      startDate.setDate(endDate.getDate() - 29);
  }

  return { startDate, endDate };
}

export default function AnalyticsPage() {
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'checkouts'>('views');
  const [selectedAttributionModel, setSelectedAttributionModel] = useState<AttributionModel>('firstTouch');
  const [filters, setFilters] = useState<AnalyticsFilters>({
    period: '30d',
    channel: 'all',
    category: 'all',
    product: 'all',
  });
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        const { startDate, endDate } = getPeriodRange(filters.period);
        const params: Record<string, string> = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };

        if (filters.channel !== 'all') {
          params.channel = filters.channel;
        }

        if (filters.category !== 'all') {
          params.category = filters.category;
        }

        if (filters.product !== 'all') {
          params.product = filters.product;
        }

        const response = await apiClient.get<{ data: AnalyticsSummary }>('/admin/analytics', { params });

        if (!response.success || !response.data) {
          throw new Error(response.error?.message || 'Não foi possível carregar os dados de analytics.');
        }

        setSummary(response.data.data ?? response.data);
      } catch (err: any) {
        setError(err?.message || 'Erro ao carregar analytics.');
      } finally {
        setLoading(false);
      }
    };

    void loadAnalytics();
  }, [filters]);

  useEffect(() => {
    if (!summary) {
      return;
    }

    const hasSelectedProduct = summary.availableFilters.products.some((product) => product.id === filters.product);
    if (filters.product !== 'all' && !hasSelectedProduct) {
      setFilters((current) => ({ ...current, product: 'all' }));
    }
  }, [filters.product, summary]);

  const chartData = useMemo(() => {
    if (!summary?.trend.length) {
      return [];
    }

    return summary.trend.map((item) => ({
      label: item.label,
      value: selectedMetric === 'views' ? item.views : item.checkouts,
    }));
  }, [selectedMetric, summary]);

  const maxValue = useMemo(() => {
    if (!chartData.length) {
      return 1;
    }

    return Math.max(...chartData.map((item) => item.value), 1);
  }, [chartData]);

  const topProducts = summary?.topProducts ?? [];
  const trafficSources = summary?.trafficSources ?? [];
  const overview = summary?.overview;
  const funnelStages = summary?.funnel?.stages ?? [];
  const insights = summary?.insights ?? [];
  const availableChannels = summary?.availableFilters.channels ?? [];
  const availableCategories = summary?.availableFilters.categories ?? [];
  const availableProducts = summary?.availableFilters.products ?? [];
  const attributionRows = summary?.attribution?.[selectedAttributionModel] ?? [];

  const exportReport = () => {
    if (!summary) {
      return;
    }

    const safeValue = (value: string | number | boolean) => `"${String(value).replace(/"/g, '""')}"`;
    const reportRows = [
      ['section', 'metric', 'value'],
      ['overview', 'totalEvents', summary.overview.totalEvents],
      ['overview', 'uniqueSessions', summary.overview.uniqueSessions],
      ['overview', 'pageViews', summary.overview.pageViews],
      ['overview', 'checkoutStarted', summary.overview.checkoutStarted],
      ['overview', 'checkoutCompleted', summary.overview.checkoutCompleted],
      ['overview', 'conversionRate', `${summary.overview.conversionRate}%`],
      ['funnel', 'overallConversionRate', `${summary.funnel.overallConversionRate}%`],
    ];

    summary.funnel.stages.forEach((stage) => {
      reportRows.push(['funnel', stage.name, `${stage.count} | ${stage.conversionRate}% | ${stage.dropoff}%`]);
    });

    summary.insights.forEach((item) => {
      reportRows.push(['insights', item.title, `${item.severity}: ${item.message}`]);
    });

    const csv = reportRows
      .map((row) => row.map((cell) => safeValue(cell)).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Tranzor-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Análises — Tranzor Admin</title>
        <meta name="description" content="Painel de analytics em tempo real do Tranzor admin." />
        <link rel="canonical" href="https://Tranzor.pt/admin/analytics" />
      </Helmet>

      <section className="page-hero">
        <h1>Análises</h1>
        <p className="page-copy">
          Monitorize o comportamento real dos utilizadores, os pontos de abandono e os produtos com maior impacto.
        </p>
      </section>

      <section className="container" style={{ display: 'grid', gap: '2rem' }}>
        <div className="page-panel" style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ marginBottom: '0.25rem' }}>Resumo das sessões</h2>
              <p style={{ margin: 0, color: '#5b6470' }}>
                Dados agregados a partir dos eventos persistidos no backend.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-primary" onClick={exportReport}>
                Exportar relatório
              </button>
              <label htmlFor="metric-select">Métrica:</label>
              <select
                id="metric-select"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as 'views' | 'checkouts')}
                className="form-select"
              >
                <option value="views">Visitas</option>
                <option value="checkouts">Checkout</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <label style={{ display: 'grid', gap: '0.4rem' }}>
                <span style={{ fontWeight: 600 }}>Período</span>
                <select
                  value={filters.period}
                  onChange={(e) => setFilters((current) => ({ ...current, period: e.target.value as PeriodOption }))}
                  className="form-select"
                >
                  {periodOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'grid', gap: '0.4rem' }}>
                <span style={{ fontWeight: 600 }}>Canal</span>
                <select
                  value={filters.channel}
                  onChange={(e) => setFilters((current) => ({ ...current, channel: e.target.value }))}
                  className="form-select"
                >
                  <option value="all">Todos</option>
                  {availableChannels.map((channel) => (
                    <option key={channel} value={channel}>{channel}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'grid', gap: '0.4rem' }}>
                <span style={{ fontWeight: 600 }}>Categoria</span>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters((current) => ({ ...current, category: e.target.value }))}
                  className="form-select"
                >
                  <option value="all">Todas</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'grid', gap: '0.4rem' }}>
                <span style={{ fontWeight: 600 }}>Produto</span>
                <select
                  value={filters.product}
                  onChange={(e) => setFilters((current) => ({ ...current, product: e.target.value }))}
                  className="form-select"
                >
                  <option value="all">Todos</option>
                  {availableProducts.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {loading ? (
            <p style={{ margin: 0 }}>Carregando dados de analytics…</p>
          ) : error ? (
            <p style={{ margin: 0, color: '#D90429' }}>{error}</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="adm-kpis">
                <div className="adm-kpi">
                  <div className="adm-kpi-label">Eventos</div>
                  <div className="adm-kpi-val">{overview?.totalEvents ?? 0}</div>
                </div>
                <div className="adm-kpi">
                  <div className="adm-kpi-label">Sessões únicas</div>
                  <div className="adm-kpi-val">{overview?.uniqueSessions ?? 0}</div>
                </div>
                <div className="adm-kpi">
                  <div className="adm-kpi-label">Page views</div>
                  <div className="adm-kpi-val">{overview?.pageViews ?? 0}</div>
                </div>
                <div className="adm-kpi">
                  <div className="adm-kpi-label">Conversão</div>
                  <div className="adm-kpi-val">{overview?.conversionRate ?? 0}%</div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <h3 style={{ margin: 0 }}>Tendência de engajamento</h3>
                <div className="chart-container">
                  <div className="chart-bars">
                    {chartData.map((point, index) => {
                      const height = (point.value / maxValue) * 100;
                      return (
                        <div key={`${point.label}-${index}`} className="chart-bar-group">
                          <div
                            className="chart-bar"
                            style={{ height: `${height}%` }}
                            title={`${point.label}: ${point.value}`}
                          >
                            <span className="chart-bar-value">{point.value}</span>
                          </div>
                          <span className="chart-bar-label">{point.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="page-grid">
          <div className="page-card">
            <h3>Produtos com mais atrito / interesse</h3>
            <div className="analytics-list">
              {topProducts.length === 0 ? (
                <p style={{ margin: 0 }}>Sem dados suficientes ainda.</p>
              ) : (
                topProducts.map((product) => (
                  <div key={product.id} className="analytics-item">
                    <div className="analytics-item-info">
                      <span className="analytics-item-name">{product.name}</span>
                      <span className="analytics-item-meta">
                        {product.views} vistas • {product.adds} adicionados • {formatCurrency(product.revenue)}
                      </span>
                    </div>
                    <span className="analytics-growth positive">
                      {Math.round((product.adds / Math.max(product.views, 1)) * 100)}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="page-card">
            <h3>Páginas com mais tráfego</h3>
            <div className="analytics-list">
              {trafficSources.length === 0 ? (
                <p style={{ margin: 0 }}>Sem dados suficientes ainda.</p>
              ) : (
                trafficSources.map((source) => (
                  <div key={source.source} className="analytics-item">
                    <div className="analytics-item-info">
                      <span className="analytics-item-name">{source.source}</span>
                      <span className="analytics-item-meta">{source.visitors} visitantes</span>
                    </div>
                    <div className="analytics-percentage">
                      <div className="analytics-percentage-bar" style={{ width: `${source.percentage}%` }}></div>
                      <span className="analytics-percentage-text">{source.percentage}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="page-grid">
          <div className="page-card">
            <h3>Funil de conversão</h3>
            <div className="analytics-list">
              {funnelStages.length === 0 ? (
                <p style={{ margin: 0 }}>Sem dados suficientes ainda.</p>
              ) : (
                funnelStages.map((stage) => (
                  <div key={stage.name} className="analytics-item">
                    <div className="analytics-item-info">
                      <span className="analytics-item-name">{stage.name}</span>
                      <span className="analytics-item-meta">{stage.count} sessões • {stage.dropoff}% de drop-off</span>
                    </div>
                    <span className="analytics-growth positive">{stage.conversionRate}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="page-card">
            <h3>Insights acionáveis</h3>
            <div className="analytics-list">
              {insights.length === 0 ? (
                <p style={{ margin: 0 }}>Sem insights adicionais no momento.</p>
              ) : (
                insights.map((item) => (
                  <div key={item.title} className="analytics-item" style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
                      <span className="analytics-item-name">{item.title}</span>
                      <span className="analytics-growth positive">{item.severity}</span>
                    </div>
                    <span className="analytics-item-meta">{item.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="page-grid">
          <div className="page-card">
            <h3>Atribuição de conversão</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <label style={{ display: 'grid', gap: '0.4rem' }}>
                <span style={{ fontWeight: 600 }}>Modelo</span>
                <select
                  value={selectedAttributionModel}
                  onChange={(e) => setSelectedAttributionModel(e.target.value as AttributionModel)}
                  className="form-select"
                >
                  <option value="firstTouch">Primeiro clique</option>
                  <option value="lastTouch">Último clique</option>
                  <option value="assisted">Assistido</option>
                </select>
              </label>

              <div className="analytics-list">
                {attributionRows.length === 0 ? (
                  <p style={{ margin: 0 }}>Sem padrões de atribuição suficientes ainda.</p>
                ) : (
                  attributionRows.map((item) => (
                    <div key={item.source} className="analytics-item">
                      <div className="analytics-item-info">
                        <span className="analytics-item-name">{item.source}</span>
                        <span className="analytics-item-meta">{item.conversions} conversões</span>
                      </div>
                      <div className="analytics-percentage">
                        <div className="analytics-percentage-bar" style={{ width: `${item.percentage}%` }}></div>
                        <span className="analytics-percentage-text">{item.percentage}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="page-card">
            <h3>Snapshot de conversão</h3>
            <div className="adm-kpis">
              <div className="adm-kpi">
                <div className="adm-kpi-label">Add to cart</div>
                <div className="adm-kpi-val">{overview?.cartAdds ?? 0}</div>
              </div>
              <div className="adm-kpi">
                <div className="adm-kpi-label">Checkout iniciado</div>
                <div className="adm-kpi-val">{overview?.checkoutStarted ?? 0}</div>
              </div>
              <div className="adm-kpi">
                <div className="adm-kpi-label">Checkout concluído</div>
                <div className="adm-kpi-val">{overview?.checkoutCompleted ?? 0}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
