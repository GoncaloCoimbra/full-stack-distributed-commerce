import { Module } from '@nestjs/common';
import { VehiclesService } from '../modules/vehicles/vehicles.service';
import { VehiclesController } from '../modules/vehicles/controllers/vehicles.controller';
import { VehicleRepository } from '../database/repositories/vehicle.repository';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService, VehicleRepository],
  exports: [VehiclesService],
})
export class VehiclesModule {}
