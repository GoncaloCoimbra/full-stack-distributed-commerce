import { Module } from '@nestjs/common';
import { TransportsService } from '../modules/transports/transports.service';
import { TransportsController } from '../modules/transports/controllers/transports.controller';
import { TransportRepository } from '../database/repositories/transport.repository';
import { PrismaService } from '../database/prisma.service';
import { NotificationsModule } from '../modules/notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [TransportsController],
  providers: [TransportsService, TransportRepository, PrismaService],
  exports: [TransportsService],
})
export class TransportsModule {}
