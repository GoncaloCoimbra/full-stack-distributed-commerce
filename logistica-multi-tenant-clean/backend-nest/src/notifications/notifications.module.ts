import { Module } from '@nestjs/common';
import { NotificationsController } from '../modules/notifications/controllers/notifications.controller';
import { NotificationsService } from '../modules/notifications/notifications.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
