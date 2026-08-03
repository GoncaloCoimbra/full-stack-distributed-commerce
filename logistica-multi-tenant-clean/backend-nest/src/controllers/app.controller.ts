import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import Redis from 'ioredis';
import { AppService } from '../app.service';
import { Public } from '../modules/auth/decorators/public.decorator';
import { PrismaService } from '../database/prisma.service';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'API root / health check entrypoint' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Docker health check' })
  async getHealth() {
    const database = await this.checkDatabaseHealth();
    const redis = await this.checkRedisHealth();

    return {
      ok: true,
      status: 'ready',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database,
      redis,
    };
  }

  @Public()
  @Get('readyz')
  @ApiOperation({ summary: 'Readiness probe' })
  async getReadiness() {
    const database = await this.checkDatabaseHealth();
    const redis = await this.checkRedisHealth();

    return {
      ok: true,
      status: 'ready',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database,
      redis,
    };
  }

  @Public()
  @Get('livez')
  @ApiOperation({ summary: 'Liveness probe' })
  async getLiveness() {
    return {
      ok: true,
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  private async checkDatabaseHealth() {
    const configured = Boolean(process.env.DATABASE_URL);
    const health = {
      configured,
      connected: false,
      source: 'prisma',
      error: null as string | null,
    };

    if (!configured) {
      return health;
    }

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      health.connected = true;
    } catch (error) {
      health.error = String(error instanceof Error ? error.message : error);
    }

    return health;
  }

  private async checkRedisHealth() {
    const redisUrl = process.env.REDIS_URL;
    const health = {
      configured: Boolean(redisUrl),
      connected: false,
      source: 'redis',
      error: null as string | null,
    };

    if (!redisUrl) {
      return health;
    }

    const client = new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });

    try {
      await client.connect();
      const pong = await client.ping();
      health.connected = pong === 'PONG';
    } catch (error) {
      health.error = String(error instanceof Error ? error.message : error);
    } finally {
      try {
        await client.disconnect();
      } catch {
        // ignore disconnect failures
      }
    }

    return health;
  }
}
