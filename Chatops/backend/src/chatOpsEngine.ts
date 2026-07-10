import { prisma } from './prismaClient';
import { publishPortfolioEvent } from './redisClient';

const LOGISTICS_URL = process.env.LOGISTICS_URL || 'http://localhost:3000';

export class ChatOpsEngine {
  static async handleCommand(messageText: string, userId: string): Promise<string | null> {
    if (!messageText.startsWith('/')) return null;

    const [command, ...args] = messageText.trim().split(/\s+/);

    switch (command) {
      case '/stock': {
        const sku = args[0];
        if (!sku) return '❗ Especifica um SKU: /stock [sku]';

        try {
          const response = await fetch(`${LOGISTICS_URL}/api/products/stock?sku=${encodeURIComponent(sku)}`);
          const data = await response.json().catch(() => null);

          if (!response.ok) {
            throw new Error(data?.message || 'Erro ao consultar stock');
          }

          const eventPayload = {
            type: 'stock_sync',
            sku,
            stock: data?.stock,
            description: data?.description,
            source: 'chatops',
            timestamp: new Date().toISOString(),
          };

          try {
            await publishPortfolioEvent('portfolio:stock-sync', JSON.stringify(eventPayload));
          } catch (redisError: any) {
            console.warn('[chatops] Redis publish failed, continuing anyway:', redisError?.message || redisError);
          }

          return `📦 Stock real via Logistics: ${data?.description || sku} tem ${data?.stock ?? 'N/A'} unidades.`;
        } catch (error: any) {
          return `❌ SKU ${sku} não encontrado ou logística indisponível: ${error.message}`;
        }
      }
      case '/approve-credit': {
        const companyId = args[0];
        if (!companyId) return '❗ Especifica um id de empresa: /approve-credit [id_empresa]';

        try {
          await prisma.b2BClient.update({
            where: { id: companyId },
            data: { creditStatus: 'APPROVED' } as any,
          });
          return `✅ Crédito aprovado para empresa ${companyId}.`;
        } catch (error: any) {
          return `❌ Não foi possível aprovar crédito para empresa ${companyId}: ${error?.message || 'erro desconhecido'}`;
        }
      }
      default:
        return '🤖 Comando não reconhecido. Exemplos: /stock [sku] /approve-credit [id_empresa]';
    }
  }
}
