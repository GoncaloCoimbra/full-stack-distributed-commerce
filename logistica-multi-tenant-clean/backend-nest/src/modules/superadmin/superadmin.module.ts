import { Module } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { SuperAdminController } from './controllers/superadmin.controller'; // Caminho correto!
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SuperAdminController], // Nome também corrigido
  providers: [SuperadminService],
  exports: [SuperadminService],
})
export class SuperadminModule {}
