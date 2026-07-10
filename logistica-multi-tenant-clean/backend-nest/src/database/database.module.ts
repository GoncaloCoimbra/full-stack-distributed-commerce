import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TenantContextService } from '../common/tenant-context.service';

@Global()
@Module({
  providers: [PrismaService, TenantContextService],
  exports: [PrismaService, TenantContextService],
})
export class DatabaseModule {}
