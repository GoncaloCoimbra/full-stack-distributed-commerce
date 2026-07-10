// src/modules/audit-log/audit-log.module.ts
import { Module, Global } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './controllers/audit-log.controller';
import { AuditLogRepository } from '../../database/repositories/audit-log.repository';
import { DatabaseModule } from '../../database/database.module';

@Global() //  CRÍTICO: Torna o módulo disponível globalmente
@Module({
  imports: [DatabaseModule],
  controllers: [AuditLogController],
  providers: [AuditLogService, AuditLogRepository],
  exports: [AuditLogService],
})
export class AuditLogModule {}
