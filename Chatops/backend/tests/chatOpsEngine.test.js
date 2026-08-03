"use strict";
/// <reference types="jest" />
Object.defineProperty(exports, "__esModule", { value: true });
const chatOpsEngine_1 = require("../src/chatOpsEngine");
const prismaClient_1 = require("../src/prismaClient");
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
    afterEach(() => {
        jest.resetAllMocks();
        global.fetch = undefined;
    });
    it('returns null for non-command messages', async () => {
        await expect(chatOpsEngine_1.ChatOpsEngine.handleCommand('hello world', 'user-1')).resolves.toBeNull();
    });
    it('returns a help message when /stock is missing a sku', async () => {
        await expect(chatOpsEngine_1.ChatOpsEngine.handleCommand('/stock', 'user-1')).resolves.toBe('❗ Especifica um SKU: /stock [sku]');
    });
    it('returns a help message when /approve-credit is missing an id', async () => {
        await expect(chatOpsEngine_1.ChatOpsEngine.handleCommand('/approve-credit', 'user-1')).resolves.toBe('❗ Especifica um id de empresa: /approve-credit [id_empresa]');
    });
    it('returns an unknown command response for unsupported commands', async () => {
        await expect(chatOpsEngine_1.ChatOpsEngine.handleCommand('/unknown', 'user-1')).resolves.toBe('🤖 Comando não reconhecido. Exemplos: /stock [sku] /approve-credit [id_empresa]');
    });
    it('executes /stock successfully and returns Logistics stock info', async () => {
        const mockFetch = jest.fn(async () => ({
            ok: true,
            json: async () => ({ stock: 15, description: 'Demo SKU' }),
        }));
        global.fetch = mockFetch;
        await expect(chatOpsEngine_1.ChatOpsEngine.handleCommand('/stock SKU-123', 'user-1')).resolves.toBe('📦 Stock real via Logistics: Demo SKU tem 15 unidades.');
        expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/products/stock?sku=SKU-123');
    });
    it('approves credit when /approve-credit has an id', async () => {
        const updateMock = prismaClient_1.prisma.b2BClient.update;
        updateMock.mockResolvedValue({});
        await expect(chatOpsEngine_1.ChatOpsEngine.handleCommand('/approve-credit 123', 'user-1')).resolves.toBe('✅ Crédito aprovado para empresa 123.');
        expect(updateMock).toHaveBeenCalledWith({
            where: { id: '123' },
            data: { creditStatus: 'APPROVED' },
        });
    });
});
