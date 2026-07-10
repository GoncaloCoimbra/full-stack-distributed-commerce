type AnalyticsEventRecord = {
  event: string;
  anonymousId?: string;
  createdAt?: Date | string;
  meta?: Record<string, any>;
  _id?: string;
};

interface ProductSummary {
  id: string;
  name: string;
  views: number;
  adds: number;
  revenue: number;
}

export interface AnalyticsFilterCriteria {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  channel?: string;
  product?: string;
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

export interface AdminAnalyticsSummary {
  overview: {
    totalEvents: number;
    uniqueSessions: number;
    pageViews: number;
    cartAdds: number;
    checkoutStarted: number;
    checkoutCompleted: number;
    conversionRate: number;
  };
  trend: Array<{
    label: string;
    views: number;
    checkouts: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    views: number;
    adds: number;
    revenue: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
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

function normalizeDate(value?: Date | string): Date {
  if (!value) {
    return new Date();
  }

  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthLabel(date: Date) {
  return date.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });
}

function classifyPath(path?: string) {
  if (!path) {
    return 'Outros';
  }

  if (path.startsWith('/shop')) return 'Loja';
  if (path.startsWith('/product')) return 'Produto';
  if (path.startsWith('/cart')) return 'Carrinho';
  if (path.startsWith('/checkout')) return 'Checkout';
  if (path.startsWith('/account')) return 'Conta';
  return 'Outros';
}

function getStringMeta(value: unknown) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function getEventChannel(event: AnalyticsEventRecord) {
  return getStringMeta(event.meta?.channel)
    || getStringMeta(event.meta?.utm_source)
    || getStringMeta(event.meta?.source)
    || 'Direct';
}

function getEventCategory(event: AnalyticsEventRecord) {
  return getStringMeta(event.meta?.category);
}

function getEventProductId(event: AnalyticsEventRecord) {
  return getStringMeta(event.meta?.productId) || getStringMeta(event.meta?.sku);
}

function getEventProductName(event: AnalyticsEventRecord) {
  return getStringMeta(event.meta?.productName) || getEventProductId(event) || 'Produto';
}

function getTouchSource(event: AnalyticsEventRecord) {
  const channel = getEventChannel(event);

  if (channel && channel !== 'Direct') {
    return channel;
  }

  const pathLabel = classifyPath(event.meta?.path);
  if (pathLabel !== 'Outros') {
    return pathLabel;
  }

  return 'Direct';
}

function matchesFilters(event: AnalyticsEventRecord, filters: AnalyticsFilterCriteria) {
  const createdAt = normalizeDate(event.createdAt);

  if (filters.startDate && createdAt < filters.startDate) {
    return false;
  }

  if (filters.endDate && createdAt > filters.endDate) {
    return false;
  }

  if (filters.category) {
    const category = getEventCategory(event);
    if (!category || category !== filters.category) {
      return false;
    }
  }

  if (filters.channel) {
    const channel = getEventChannel(event);
    if (channel !== filters.channel) {
      return false;
    }
  }

  if (filters.product) {
    const productId = getEventProductId(event);
    if (!productId || productId !== filters.product) {
      return false;
    }
  }

  return true;
}

function addToMetric(map: Map<string, number>, source: string) {
  map.set(source, (map.get(source) || 0) + 1);
}

function buildAttributionMetrics(map: Map<string, number>, totalConversions: number): AttributionMetric[] {
  return Array.from(map.entries())
    .map(([source, conversions]) => ({
      source,
      conversions,
      percentage: totalConversions === 0 ? 0 : Number(((conversions / totalConversions) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.conversions - a.conversions || a.source.localeCompare(b.source));
}

function buildFunnelStages(sessionCounts: {
  visits: number;
  productViewed: number;
  cartAdd: number;
  checkoutStarted: number;
  checkoutCompleted: number;
}, totalVisits: number): FunnelStage[] {
  const stageRates = [sessionCounts.visits, sessionCounts.productViewed, sessionCounts.cartAdd, sessionCounts.checkoutStarted, sessionCounts.checkoutCompleted]
    .map((count) => (totalVisits === 0 ? 0 : Math.round((count / totalVisits) * 100)));

  return [
    { name: 'Visitas', count: sessionCounts.visits, conversionRate: stageRates[0], dropoff: 100 - stageRates[0] },
    { name: 'Produto visualizado', count: sessionCounts.productViewed, conversionRate: stageRates[1], dropoff: 100 - stageRates[1] },
    { name: 'Adicionado ao carrinho', count: sessionCounts.cartAdd, conversionRate: stageRates[2], dropoff: 100 - stageRates[2] },
    { name: 'Checkout iniciado', count: sessionCounts.checkoutStarted, conversionRate: stageRates[3], dropoff: 100 - stageRates[3] },
    { name: 'Checkout concluído', count: sessionCounts.checkoutCompleted, conversionRate: stageRates[4], dropoff: 100 - stageRates[4] },
  ];
}

function buildInsights(params: {
  checkoutStarted: number;
  checkoutCompleted: number;
  cartAdds: number;
  topProducts: ProductSummary[];
  funnelStages: FunnelStage[];
}): Insight[] {
  const insights: Insight[] = [];
  const recommendationByStage: Record<string, string> = {
    Visitas: 'Aprimore a entrada com campanhas mais qualificadas e copy mais relevante para o público-alvo.',
    'Produto visualizado': 'Reforce imagem, preço e descrição para transformar visualizações em ações reais.',
    'Adicionado ao carrinho': 'Mostre frete e benefícios de forma clara para reduzir o abandono antes do checkout.',
    'Checkout iniciado': 'Revise etapas finais, validações e métodos de pagamento para reduzir a perda no fechamento.',
    'Checkout concluído': 'Monitore confirmação, pós-venda e suporte para proteger a conversão final.',
  };

  if (params.checkoutStarted > 0 && params.checkoutCompleted / params.checkoutStarted <= 0.5) {
    insights.push({
      title: 'Perda de conversão no checkout',
      message: 'Muitos utilizadores iniciam o checkout, mas abandonam antes da conclusão. Revise o fluxo, frete e validações.',
      severity: 'warning',
    });
  }

  if (params.cartAdds > 0 && params.checkoutStarted / params.cartAdds <= 0.5) {
    insights.push({
      title: 'Carrinho com baixa evolução',
      message: 'Os utilizadores adicionam produtos, mas poucos avançam para o checkout. Avalie a experiência do carrinho e os incentivos.',
      severity: 'warning',
    });
  }

  const hotspot = [...params.funnelStages]
    .filter((stage) => stage.dropoff > 0)
    .sort((a, b) => b.dropoff - a.dropoff)[0];

  if (hotspot) {
    insights.push({
      title: 'Ponto de maior abandono',
      message: `${hotspot.name} está a perder ${hotspot.dropoff}% das sessões. ${recommendationByStage[hotspot.name] || 'Revise o CTA, o copy e a clareza da etapa para reduzir o abandono.'}`,
      severity: hotspot.dropoff >= 50 ? 'warning' : 'info',
    });
  }

  const lowConversionProduct = params.topProducts.find((product) => product.views > 0 && product.adds / product.views < 0.15);
  if (lowConversionProduct) {
    insights.push({
      title: 'Produto com baixa conversão',
      message: `${lowConversionProduct.name} recebe muitas visualizações, mas poucos adicionados ao carrinho. Reavalie preço, imagem e descrição.`,
      severity: 'info',
    });
  }

  if (insights.length === 0) {
    insights.push({
      title: 'Fluxo de conversão saudável',
      message: 'O funil está consistente e sem sinais fortes de abandono no momento.',
      severity: 'info',
    });
  }

  return insights;
}

export function summarizeAnalyticsEvents(events: AnalyticsEventRecord[], filters: AnalyticsFilterCriteria = {}): AdminAnalyticsSummary {
  const now = new Date();
  const trend = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    return { label: getMonthLabel(monthDate), views: 0, checkouts: 0 };
  });

  const sessions = new Set<string>();
  const sessionMap = new Map<string, AnalyticsEventRecord[]>();
  const productMap = new Map<string, ProductSummary>();
  const pathCounts = new Map<string, number>();
  const channels = new Set<string>();
  const categories = new Set<string>();
  const products = new Map<string, string>();
  const funnelSessions = {
    visits: new Set<string>(),
    productViewed: new Set<string>(),
    cartAdd: new Set<string>(),
    checkoutStarted: new Set<string>(),
    checkoutCompleted: new Set<string>(),
  };

  let totalEvents = 0;
  let pageViews = 0;
  let cartAdds = 0;
  let checkoutStarted = 0;
  let checkoutCompleted = 0;

  const filteredEvents = events.filter((event) => matchesFilters(event, filters));
  const getSessionId = (event: AnalyticsEventRecord) => event.anonymousId || event._id || `${normalizeDate(event.createdAt).getTime()}-${Math.random()}`;

  for (const event of filteredEvents) {
    totalEvents += 1;
    const createdAt = normalizeDate(event.createdAt);
    const sessionId = getSessionId(event);

    sessions.add(sessionId);

    if (!sessionMap.has(sessionId)) {
      sessionMap.set(sessionId, []);
    }

    sessionMap.get(sessionId)!.push(event);

    const channel = getEventChannel(event);
    const category = getEventCategory(event);
    const productId = getEventProductId(event);
    const productName = getEventProductName(event);

    if (channel) {
      channels.add(channel);
    }

    if (category) {
      categories.add(category);
    }

    if (productId) {
      products.set(productId, productName);
    }

    if (event.event === 'page_view') {
      pageViews += 1;
      funnelSessions.visits.add(sessionId);
      const monthKeyValue = getMonthKey(createdAt);
      const index = trend.findIndex(item => item.label === getMonthLabel(new Date(`${monthKeyValue}-01T00:00:00.000Z`)));
      if (index >= 0) {
        trend[index].views += 1;
      }

      const pathLabel = classifyPath(event.meta?.path);
      pathCounts.set(pathLabel, (pathCounts.get(pathLabel) || 0) + 1);
    }

    if (event.event === 'cart_add') {
      cartAdds += 1;
      funnelSessions.cartAdd.add(sessionId);
      const current = productMap.get(productId || 'unknown') || { id: productId || 'unknown', name: productName, views: 0, adds: 0, revenue: 0 };
      const quantity = Number(event.meta?.quantity || 1);
      const price = Number(event.meta?.price || 0);
      current.adds += 1;
      current.revenue += quantity * price;
      current.name = productName;
      productMap.set(productId || 'unknown', current);
    }

    if (event.event === 'product_viewed') {
      funnelSessions.productViewed.add(sessionId);
      const current = productMap.get(productId || 'unknown') || { id: productId || 'unknown', name: productName, views: 0, adds: 0, revenue: 0 };
      current.views += 1;
      current.name = productName;
      productMap.set(productId || 'unknown', current);
    }

    if (event.event === 'checkout_started') {
      checkoutStarted += 1;
      funnelSessions.checkoutStarted.add(sessionId);
      const monthKeyValue = getMonthKey(createdAt);
      const index = trend.findIndex(item => item.label === getMonthLabel(new Date(`${monthKeyValue}-01T00:00:00.000Z`)));
      if (index >= 0) {
        trend[index].checkouts += 1;
      }
    }

    if (event.event === 'checkout_completed') {
      checkoutCompleted += 1;
      funnelSessions.checkoutCompleted.add(sessionId);
    }
  }

  const firstTouch = new Map<string, number>();
  const lastTouch = new Map<string, number>();
  const assisted = new Map<string, number>();
  let convertedSessions = 0;

  for (const sessionEvents of sessionMap.values()) {
    const ordered = [...sessionEvents].sort((a, b) => normalizeDate(a.createdAt).getTime() - normalizeDate(b.createdAt).getTime());
    const conversionIndex = ordered.findIndex((event) => event.event === 'checkout_started' || event.event === 'checkout_completed');

    if (conversionIndex === -1) {
      continue;
    }

    convertedSessions += 1;

    const touchEvents = ordered
      .slice(0, conversionIndex + 1)
      .filter((event) => event.event === 'page_view' || event.event === 'product_viewed');

    if (touchEvents.length > 0) {
      addToMetric(firstTouch, getTouchSource(touchEvents[0]));
      addToMetric(lastTouch, getTouchSource(touchEvents[touchEvents.length - 1]));

      const assistedSources = new Set(touchEvents.map((event) => getTouchSource(event)));
      assistedSources.forEach((source) => addToMetric(assisted, source));
    }
  }

  const totalPageViews = pageViews || 1;
  const conversionRate = checkoutStarted === 0 ? 0 : Math.round((checkoutCompleted / checkoutStarted) * 100);
  const totalVisits = funnelSessions.visits.size || sessions.size;

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.adds - a.adds || b.views - a.views)
    .slice(0, 5);

  const sourceOrder = ['Loja', 'Produto', 'Carrinho', 'Checkout', 'Conta', 'Outros'];

  const trafficSources = Array.from(pathCounts.entries())
    .map(([source, visitors]) => ({
      source,
      visitors,
      percentage: Number(((visitors / totalPageViews) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.visitors - a.visitors || (sourceOrder.indexOf(a.source) - sourceOrder.indexOf(b.source)));

  const funnel = {
    stages: buildFunnelStages({
      visits: funnelSessions.visits.size,
      productViewed: funnelSessions.productViewed.size,
      cartAdd: funnelSessions.cartAdd.size,
      checkoutStarted: funnelSessions.checkoutStarted.size,
      checkoutCompleted: funnelSessions.checkoutCompleted.size,
    }, totalVisits),
    overallConversionRate: conversionRate,
  };

  return {
    overview: {
      totalEvents,
      uniqueSessions: sessions.size,
      pageViews,
      cartAdds,
      checkoutStarted,
      checkoutCompleted,
      conversionRate,
    },
    trend,
    topProducts,
    trafficSources,
    attribution: {
      firstTouch: buildAttributionMetrics(firstTouch, convertedSessions),
      lastTouch: buildAttributionMetrics(lastTouch, convertedSessions),
      assisted: buildAttributionMetrics(assisted, convertedSessions),
    },
    funnel,
    insights: buildInsights({
      checkoutStarted: funnelSessions.checkoutStarted.size,
      checkoutCompleted: funnelSessions.checkoutCompleted.size,
      cartAdds: funnelSessions.cartAdd.size,
      topProducts,
      funnelStages: funnel.stages,
    }),
    availableFilters: {
      channels: Array.from(channels).sort((a, b) => a.localeCompare(b)),
      categories: Array.from(categories).sort((a, b) => a.localeCompare(b)),
      products: Array.from(products.entries())
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    },
  };
}
