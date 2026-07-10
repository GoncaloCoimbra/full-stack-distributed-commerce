import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { Transport } from '@prisma/client';

@Injectable()
export class TransportRepository extends BaseRepository<Transport> {
  constructor(prisma: PrismaService) {
    super(prisma, 'transport');
  }

  async findByCompany(companyId: string): Promise<Transport[]> {
    return this.prisma.transport.findMany({
      where: { companyId },
      include: {
        company: true,
        vehicle: true,
      },
    });
  }

  async findByStatus(status: string): Promise<Transport[]> {
    return this.prisma.transport.findMany({
      where: { status: status as any },
    });
  }

  async findByCompanyId(companyId: string, filters?: any) {
    return this.prisma.transport.findMany({
      where: { companyId, ...filters },
    });
  }

  async findPending(companyId: string) {
    return this.prisma.transport.findMany({
      where: { companyId, status: 'PENDING' },
    });
  }

  async findInTransit(companyId: string) {
    return this.prisma.transport.findMany({
      where: { companyId, status: 'IN_TRANSIT' },
    });
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.transport.update({
      where: { id },
      data: { status },
    });
  }
}
