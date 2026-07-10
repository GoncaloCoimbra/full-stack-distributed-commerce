import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { Product } from '@prisma/client';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(prisma: PrismaService) {
    super(prisma, 'product');
  }

  async findByCompany(companyId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { companyId },
      include: {
        company: true,
      },
    });
  }

  async findByStatus(status: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { status: status as any },
    });
  }

  async findByInternalCode(code: string, companyId: string) {
    return this.prisma.product.findFirst({
      where: { internalCode: code, companyId },
    });
  }

  async findByCompanyId(companyId: string, filters?: any) {
    return this.prisma.product.findMany({
      where: { companyId, ...filters },
    });
  }

  async findWithMovements(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { movements: true },
    });
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.product.update({
      where: { id },
      data: { status },
    });
  }

  async countByStatus(companyId: string, status: any) {
    return this.prisma.product.count({
      where: { companyId, status },
    });
  }
}
