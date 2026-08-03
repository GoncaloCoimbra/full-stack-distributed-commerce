/// <reference types="jest" />

import { ChatOpsEngine, logisticsCircuitBreaker } from '../src/chatOpsEngine';
import { prisma } from '../src/prismaClient';

jest.mock('../src/prismaClient', () => ({
  prisma: {
    b2BClient: {
      update: jest.fn(),
    },
  },
}));

jest.mock('../src/redisClient', () => ({
  publishPortfolioEvent: jest.fn().mockResolvedValue(undefined),
}));

describe('ChatOpsEngine', () => {
  jest.setTimeout(20000);

  afterEach(() => {
    jest.resetAllMocks();
    (global as any).fetch = undefined;
    (globalThis as any).fetch = undefined;
  });

  it('returns null for non-command messages', async () => {
    await expect(ChatOpsEngine.handleCommand('hello world', 'user-1')).resolves.toBeNull();
  });

  it('returns a help message when /stock is missing a sku', async () => {
    await expect(ChatOpsEngine.handleCommand('/stock', 'user-1')).resolves.toBe(
      '❗ Especifica um SKU: /stock [sku]',
    );
  });

  it('returns a help message when /approve-credit is missing an id', async () => {
    await expect(ChatOpsEngine.handleCommand('/approve-credit', 'user-1')).resolves.toBe(
      '❗ Especifica um id de empresa: /approve-credit [id_empresa]',
    );
  });

  it('returns an unknown command response for unsupported commands', async () => {
    await expect(ChatOpsEngine.handleCommand('/unknown', 'user-1')).resolves.toBe(
      '🤖 Comando não reconhecido. Exemplos: /stock [sku] /approve-credit [id_empresa]',
    );
  });

  it('executes /stock successfully and returns Logistics stock info', async () => {
    const mockFetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ stock: 15, description: 'Demo SKU' }),
    }));
    (global as any).fetch = mockFetch;

    await expect(ChatOpsEngine.handleCommand('/stock SKU-123', 'user-1')).resolves.toBe(
      '📦 Stock real via Logistics: Demo SKU tem 15 unidades.',
    );

    // Expected URL depends on LOGISTICS_URL env var (default: http://logistica-backend:3000)
    const expectedUrl = `${process.env.LOGISTICS_URL || 'http://logistica-backend:3000'}/api/products/stock?sku=SKU-123`;
    expect(mockFetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
  });

  it('approves credit when /approve-credit has an id', async () => {
    const updateMock = prisma.b2BClient.update as jest.Mock;
    updateMock.mockResolvedValue({});

    await expect(ChatOpsEngine.handleCommand('/approve-credit 123', 'user-1')).resolves.toBe(
      '✅ Crédito aprovado para empresa 123.',
    );

    expect(updateMock).toHaveBeenCalledWith({
      where: { id: '123' },
      data: { creditStatus: 'APPROVED' },
    });
  });

  it('opens the circuit breaker on repeated Logistics failures and returns the fallback message', async () => {
    const networkError = new Error('network failure') as any;
    networkError.name = 'AbortError';

    const mockFetch = jest.fn()
      .mockRejectedValueOnce(networkError)
      .mockRejectedValueOnce(networkError)
      .mockRejectedValueOnce(networkError)
      .mockRejectedValueOnce(networkError)
      .mockRejectedValueOnce(networkError)
      .mockRejectedValueOnce(networkError)
      .mockRejectedValueOnce(networkError)
      .mockRejectedValueOnce(networkError)
      .mockRejectedValueOnce(networkError)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ stock: 22, description: 'Recovered SKU' }),
      });

    const originalGlobalFetch = (global as any).fetch;
    const originalGlobalThisFetch = (globalThis as any).fetch;
    (global as any).fetch = mockFetch;
    (globalThis as any).fetch = mockFetch;
    logisticsCircuitBreaker.reset();

    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_000_000);

    // Each failed /stock request does 3 retries and counts as one circuit failure.
    await expect(ChatOpsEngine.handleCommand('/stock SKU-FAIL', 'user-1')).resolves.toMatch(/indisponível/);
    await expect(ChatOpsEngine.handleCommand('/stock SKU-FAIL', 'user-1')).resolves.toMatch(/indisponível/);
    await expect(ChatOpsEngine.handleCommand('/stock SKU-FAIL', 'user-1')).resolves.toMatch(/indisponível/);

    expect(mockFetch).toHaveBeenCalledTimes(9);

    // Next call before reset timeout should return the circuit breaker fallback immediately.
    await expect(ChatOpsEngine.handleCommand('/stock SKU-FAIL', 'user-1')).resolves.toBe(
      '❌ Logística está temporariamente indisponível. Tente novamente em alguns segundos.',
    );

    nowSpy.mockReturnValue(1_000_000 + 31_000);

    await expect(ChatOpsEngine.handleCommand('/stock SKU-RECOVER', 'user-1')).resolves.toBe(
      '📦 Stock real via Logistics: Recovered SKU tem 22 unidades.',
    );

    nowSpy.mockRestore();
    (global as any).fetch = originalGlobalFetch;
    (globalThis as any).fetch = originalGlobalThisFetch;
  });
});
