import { summarizeAnalyticsEvents } from '../../server/services/analyticsSummary';

describe('summarizeAnalyticsEvents', () => {
  it('builds a real analytics summary from stored events', () => {
    const events = [
      {
        event: 'page_view',
        anonymousId: 'sess-1',
        createdAt: new Date('2026-05-01T10:00:00.000Z'),
        meta: { path: '/shop', channel: 'Organic' },
      },
      {
        event: 'page_view',
        anonymousId: 'sess-2',
        createdAt: new Date('2026-05-02T10:00:00.000Z'),
        meta: { path: '/product/1', channel: 'Email' },
      },
      {
        event: 'product_viewed',
        anonymousId: 'sess-2',
        createdAt: new Date('2026-05-02T10:00:00.000Z'),
        meta: { productId: 'prod-1', productName: 'Lápis', category: 'Escolar', channel: 'Email' },
      },
      {
        event: 'cart_add',
        anonymousId: 'sess-2',
        createdAt: new Date('2026-05-03T10:00:00.000Z'),
        meta: { productId: 'prod-1', productName: 'Lápis', category: 'Escolar', quantity: 2, price: 5, channel: 'Email' },
      },
      {
        event: 'checkout_started',
        anonymousId: 'sess-2',
        createdAt: new Date('2026-05-04T10:00:00.000Z'),
        meta: { source: 'cart', channel: 'Email' },
      },
      {
        event: 'checkout_completed',
        anonymousId: 'sess-2',
        createdAt: new Date('2026-05-05T10:00:00.000Z'),
        meta: { source: 'checkout', channel: 'Email' },
      },
      {
        event: 'page_view',
        anonymousId: 'sess-3',
        createdAt: new Date('2026-05-05T11:00:00.000Z'),
        meta: { path: '/checkout', channel: 'Organic' },
      },
    ] as any;

    const summary = summarizeAnalyticsEvents(events);

    expect(summary.overview.totalEvents).toBe(7);
    expect(summary.overview.uniqueSessions).toBe(3);
    expect(summary.overview.pageViews).toBe(3);
    expect(summary.overview.cartAdds).toBe(1);
    expect(summary.overview.checkoutStarted).toBe(1);
    expect(summary.overview.checkoutCompleted).toBe(1);
    expect(summary.overview.conversionRate).toBe(100);
    expect(summary.topProducts).toEqual([
      expect.objectContaining({
        name: 'Lápis',
        views: 1,
        adds: 1,
        revenue: 10,
      }),
    ]);
    expect(summary.trafficSources).toEqual([
      expect.objectContaining({ source: 'Loja', visitors: 1, percentage: 33.33 }),
      expect.objectContaining({ source: 'Produto', visitors: 1, percentage: 33.33 }),
      expect.objectContaining({ source: 'Checkout', visitors: 1, percentage: 33.33 }),
    ]);
    expect(summary.availableFilters.channels).toEqual(['Email', 'Organic']);
    expect(summary.availableFilters.categories).toEqual(['Escolar']);
    expect(summary.availableFilters.products).toEqual([
      expect.objectContaining({ id: 'prod-1', name: 'Lápis' }),
    ]);
  });

  it('filters analytics by period, category, channel and product', () => {
    const events = [
      {
        event: 'page_view',
        anonymousId: 'sess-1',
        createdAt: new Date('2026-05-01T10:00:00.000Z'),
        meta: { path: '/shop', channel: 'Organic', category: 'Escolar', productId: 'prod-1' },
      },
      {
        event: 'product_viewed',
        anonymousId: 'sess-1',
        createdAt: new Date('2026-05-01T11:00:00.000Z'),
        meta: { productId: 'prod-1', productName: 'Lápis', category: 'Escolar', channel: 'Organic' },
      },
      {
        event: 'cart_add',
        anonymousId: 'sess-2',
        createdAt: new Date('2026-05-10T11:00:00.000Z'),
        meta: { productId: 'prod-2', productName: 'Caneta', category: 'Escrita', channel: 'Email' },
      },
      {
        event: 'checkout_started',
        anonymousId: 'sess-2',
        createdAt: new Date('2026-05-10T12:00:00.000Z'),
        meta: { source: 'cart', channel: 'Email' },
      },
    ] as any;

    const summary = summarizeAnalyticsEvents(events, {
      startDate: new Date('2026-05-01T00:00:00.000Z'),
      endDate: new Date('2026-05-31T23:59:59.000Z'),
      category: 'Escolar',
      channel: 'Organic',
      product: 'prod-1',
    });

    expect(summary.overview.totalEvents).toBe(2);
    expect(summary.overview.pageViews).toBe(1);
    expect(summary.overview.cartAdds).toBe(0);
    expect(summary.overview.checkoutStarted).toBe(0);
    expect(summary.topProducts).toEqual([
      expect.objectContaining({ id: 'prod-1', name: 'Lápis', views: 1, adds: 0, revenue: 0 }),
    ]);
    expect(summary.trafficSources).toEqual([
      expect.objectContaining({ source: 'Loja', visitors: 1, percentage: 100 }),
    ]);
  });

  it('builds attribution summaries for converted sessions', () => {
    const events = [
      {
        event: 'page_view',
        anonymousId: 'sess-attr',
        createdAt: new Date('2026-05-01T10:00:00.000Z'),
        meta: { path: '/shop', channel: 'Organic' },
      },
      {
        event: 'product_viewed',
        anonymousId: 'sess-attr',
        createdAt: new Date('2026-05-01T10:15:00.000Z'),
        meta: { productId: 'prod-1', productName: 'Lápis', channel: 'Organic' },
      },
      {
        event: 'checkout_started',
        anonymousId: 'sess-attr',
        createdAt: new Date('2026-05-01T10:30:00.000Z'),
        meta: { channel: 'Organic' },
      },
    ] as any;

    const summary = summarizeAnalyticsEvents(events);

    expect(summary.attribution.firstTouch).toEqual([
      expect.objectContaining({ source: 'Organic', conversions: 1, percentage: 100 }),
    ]);
    expect(summary.attribution.lastTouch).toEqual([
      expect.objectContaining({ source: 'Organic', conversions: 1, percentage: 100 }),
    ]);
    expect(summary.attribution.assisted).toEqual([
      expect.objectContaining({ source: 'Organic', conversions: 1, percentage: 100 }),
    ]);
  });

  it('builds funnel and actionable insights for the admin dashboard', () => {
    const events = [
      {
        event: 'page_view',
        anonymousId: 'sess-1',
        createdAt: new Date('2026-05-01T10:00:00.000Z'),
        meta: { path: '/shop', channel: 'Organic' },
      },
      {
        event: 'product_viewed',
        anonymousId: 'sess-1',
        createdAt: new Date('2026-05-01T10:05:00.000Z'),
        meta: { productId: 'prod-1', productName: 'Lápis', channel: 'Organic' },
      },
      {
        event: 'cart_add',
        anonymousId: 'sess-1',
        createdAt: new Date('2026-05-01T10:10:00.000Z'),
        meta: { productId: 'prod-1', productName: 'Lápis', channel: 'Organic' },
      },
      {
        event: 'checkout_started',
        anonymousId: 'sess-1',
        createdAt: new Date('2026-05-01T10:15:00.000Z'),
        meta: { channel: 'Organic' },
      },
      {
        event: 'checkout_completed',
        anonymousId: 'sess-1',
        createdAt: new Date('2026-05-01T10:20:00.000Z'),
        meta: { channel: 'Organic' },
      },
      {
        event: 'page_view',
        anonymousId: 'sess-2',
        createdAt: new Date('2026-05-01T10:25:00.000Z'),
        meta: { path: '/checkout', channel: 'Organic' },
      },
      {
        event: 'checkout_started',
        anonymousId: 'sess-2',
        createdAt: new Date('2026-05-01T10:25:00.000Z'),
        meta: { channel: 'Organic' },
      },
    ] as any;

    const summary = summarizeAnalyticsEvents(events);

    expect(summary.funnel.stages).toEqual([
      expect.objectContaining({ name: 'Visitas', count: 2, conversionRate: 100, dropoff: 0 }),
      expect.objectContaining({ name: 'Produto visualizado', count: 1, conversionRate: 50, dropoff: 50 }),
      expect.objectContaining({ name: 'Adicionado ao carrinho', count: 1, conversionRate: 50, dropoff: 50 }),
      expect.objectContaining({ name: 'Checkout iniciado', count: 2, conversionRate: 100, dropoff: 0 }),
      expect.objectContaining({ name: 'Checkout concluído', count: 1, conversionRate: 50, dropoff: 50 }),
    ]);
    expect(summary.funnel.overallConversionRate).toBe(50);
    expect(summary.insights).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Perda de conversão no checkout',
          severity: 'warning',
        }),
        expect.objectContaining({
          title: 'Ponto de maior abandono',
          severity: 'warning',
        }),
      ]),
    );

    expect(summary.insights).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining('Produto visualizado'),
        }),
      ]),
    );
  });
});
