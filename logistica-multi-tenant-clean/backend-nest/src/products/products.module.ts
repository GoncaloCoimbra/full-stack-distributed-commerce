import { Module } from '@nestjs/common';
import { AuditLogRepository } from '../database/repositories/audit-log.repository';
import { ProductsService } from '../modules/products/products.service';
import { ProductsController } from '../modules/products/controllers/products.controller';
import { ProductRepository } from '../database/repositories/product.repository';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository, AuditLogRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
