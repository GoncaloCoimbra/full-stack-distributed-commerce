import { Module } from '@nestjs/common';
import { TransportsService } from './transports.service';
import { TransportsController } from './controllers/transports.controller';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [NotificationsModule, AuditLogModule],
  controllers: [TransportsController],
  providers: [TransportsService, PrismaService],
  exports: [TransportsService],
})
export class TransportsModule {}
