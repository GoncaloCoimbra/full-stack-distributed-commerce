import { Controller, Get } from '@nestjs/common';
import * as client from 'prom-client';
import { Public } from '../../modules/auth/decorators/public.decorator';

const collectDefaultMetrics =
  client.collectDefaultMetrics || client.collectDefaultMetrics;
collectDefaultMetrics();

@Controller('metrics')
export class MetricsController {
  @Public()
  @Get()
  async metrics() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      prom: await client.register.metrics(),
    };
  }
}
