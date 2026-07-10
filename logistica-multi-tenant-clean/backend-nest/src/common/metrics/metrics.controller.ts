import { Controller, Get } from '@nestjs/common';
import * as client from 'prom-client';

const collectDefaultMetrics =
  client.collectDefaultMetrics || client.collectDefaultMetrics;
collectDefaultMetrics();

@Controller('metrics')
export class MetricsController {
  @Get()
  async metrics() {
    return await client.register.metrics();
  }
}
