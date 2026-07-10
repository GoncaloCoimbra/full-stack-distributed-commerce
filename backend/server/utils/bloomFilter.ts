/**
 * Redis Bloom Filters
 * Estrutura probabilística ultra-rápida para evitar queries desnecessárias ao MongoDB.
 * Pergunta instantaneamente: "Este produto existe?" sem bater na BD.
 */

import Redis from 'ioredis';
import { env } from '../config/env';

export class BloomFilterCache {
  private redis: Redis | null;
  private readonly errorRate = 0.01; // 1% de false positives tolerável
  private readonly prefix = 'bloom:';

  constructor() {
    this.redis = this.createRedisClient();
  }

  private createRedisClient(): Redis | null {
    if (!env.REDIS_URL || process.env.NODE_ENV === 'test' || process.env.DISABLE_REDIS === 'true' || process.env.JEST_WORKER_ID !== undefined) {
      return null;
    }

    const client = new Redis(env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
    });

    client.on('error', () => {
      // Ignore connection noise in degraded/demo environments.
    });

    return client;
  }

  private async ensureRedis(): Promise<Redis | null> {
    if (!this.redis) {
      return null;
    }

    if (this.redis.status !== 'ready') {
      try {
        await this.redis.connect();
      } catch {
        return null;
      }
    }

    return this.redis;
  }

  /**
   * Calcular tamanho recomendado do filtro
   * Para N elementos com taxa de erro E: m = -(N * ln(E)) / (ln(2)^2)
   */
  private calculateFilterSize(expectedElements: number): number {
    const ln2Squared = Math.pow(Math.log(2), 2);
    return Math.ceil(-(expectedElements * Math.log(this.errorRate)) / ln2Squared);
  }

  /**
   * Adicionar um elemento ao Bloom Filter
   */
  async add(filterName: string, element: string): Promise<boolean> {
    const redis = await this.ensureRedis();
    if (!redis) return false;

    try {
      const key = `${this.prefix}${filterName}`;

      // BF.ADD é um comando do módulo RedisBloom
      // Se não estiver instalado, fazer fallback para SET
      try {
        const result = await (redis as any).bf.add(key, element);
        return result === 1;
      } catch {
        // Fallback: usar SET simples
        await redis.sadd(key, element);
        await redis.expire(key, 86400); // 24h TTL
        return true;
      }
    } catch (error) {
      console.error('Erro ao adicionar ao Bloom Filter:', error);
      return false;
    }
  }

  /**
   * Verificar se um elemento pode estar no filtro (pode ter false positives)
   */
  async exists(filterName: string, element: string): Promise<boolean> {
    const redis = await this.ensureRedis();
    if (!redis) return true; // Sem Redis, assumir que existe

    try {
      const key = `${this.prefix}${filterName}`;

      try {
        const result = await (redis as any).bf.exists(key, element);
        return result === 1;
      } catch {
        // Fallback: usar SISMEMBER
        const result = await redis.sismember(key, element);
        return result === 1;
      }
    } catch (error) {
      console.error('Erro ao verificar Bloom Filter:', error);
      return true; // Em caso de erro, assumir que existe (seguro)
    }
  }

  /**
   * Adicionar múltiplos elementos de uma vez
   */
  async addMultiple(filterName: string, elements: string[]): Promise<boolean> {
    const redis = await this.ensureRedis();
    if (!redis) return false;

    try {
      const key = `${this.prefix}${filterName}`;

      try {
        // BF.MADD para múltiplos elementos
        await (redis as any).bf.madd(key, ...elements);
        return true;
      } catch {
        // Fallback: usar SADD
        await redis.sadd(key, ...elements);
        await redis.expire(key, 86400);
        return true;
      }
    } catch (error) {
      console.error('Erro ao adicionar múltiplos ao Bloom Filter:', error);
      return false;
    }
  }

  /**
   * Resetar um Bloom Filter
   */
  async reset(filterName: string): Promise<boolean> {
    const redis = await this.ensureRedis();
    if (!redis) return false;

    try {
      const key = `${this.prefix}${filterName}`;
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Erro ao resetar Bloom Filter:', error);
      return false;
    }
  }

  /**
   * Inicializar o Bloom Filter com produtos ativos
   * Chamar isto durante bootstrap ou periodicamente via job
   */
  async initializeProductFilter(): Promise<void> {
    const redis = await this.ensureRedis();
    if (!redis) return;

    try {
      const Product = require('../models/Product').default;
      const products = await Product.find({ isActive: true }).select('_id').lean();

      const productIds = products.map((p: any) => p._id.toString());
      await this.addMultiple('products', productIds);

      console.log(`✅ Bloom Filter de produtos inicializado com ${productIds.length} produtos`);
    } catch (error) {
      console.error('Erro ao inicializar Bloom Filter de produtos:', error);
    }
  }

  /**
   * Padrão de uso: verificar se existe antes de bater na BD
   */
  async productExistsOrCheck(productId: string): Promise<boolean> {
    // Pergunta rápida ao Bloom Filter
    const mayExist = await this.exists('products', productId);

    if (!mayExist) {
      // Bloom Filter diz definitivamente que NÃO existe
      return false;
    }

    // Bloom Filter diz que PODE existir, mas pode ser false positive
    // Então bate na BD para confirmar
    const Product = require('../models/Product').default;
    const exists = await Product.exists({ _id: productId });
    return exists !== null;
  }

  /**
   * Registar um novo produto no Bloom Filter
   */
  async registerNewProduct(productId: string): Promise<void> {
    await this.add('products', productId);
  }

  /**
   * Remover um produto do Bloom Filter (requer reconstrução)
   */
  async removeProduct(productId: string): Promise<void> {
    // Bloom Filters não suportam remoção eficiente
    // Solução: reconstruir periodicamente ou manter outro índice de deletados
    const redis = await this.ensureRedis();
    const key = `${this.prefix}deleted_products`;
    if (redis) {
      await redis.sadd(key, productId);
    }
  }

  /**
   * Obter métricas do Bloom Filter
   */
  async getMetrics(filterName: string): Promise<{ size: number; falsePositiveRate: number }> {
    const redis = await this.ensureRedis();
    if (!redis) return { size: 0, falsePositiveRate: this.errorRate };

    try {
      const key = `${this.prefix}${filterName}`;
      const info = await (redis as any).bf.info(key);

      return {
        size: info?.capacity || 0,
        falsePositiveRate: this.errorRate,
      };
    } catch {
      return { size: 0, falsePositiveRate: this.errorRate };
    }
  }
}

export const bloomFilter = new BloomFilterCache();
