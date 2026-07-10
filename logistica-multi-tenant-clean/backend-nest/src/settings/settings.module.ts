import { Module } from '@nestjs/common';
import { SettingsController } from '../modules/settings/controllers/settings.controller';
import { SettingsService } from './settings.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
