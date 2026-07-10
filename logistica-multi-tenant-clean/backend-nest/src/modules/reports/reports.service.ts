import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateProductReport(companyId: string) {
    const products = await this.prisma.product.findMany({
      where: { companyId },
      include: { supplier: true, company: true },
    });

    return { title: 'Product Report', data: products, generatedAt: new Date() };
  }

  async generateTransportReport(companyId: string) {
    const transports = await this.prisma.transport.findMany({
      where: { companyId },
      include: { vehicle: true },
    });

    return {
      title: 'Relatório de Transportes',
      data: transports,
      generatedAt: new Date(),
    };
  }
}
