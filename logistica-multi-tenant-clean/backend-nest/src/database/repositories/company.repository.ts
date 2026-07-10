import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { Company } from '@prisma/client';

@Injectable()
export class CompanyRepository extends BaseRepository<Company> {
  constructor(prisma: PrismaService) {
    super(prisma, 'company');
  }

  async findWithUsers(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        users: true,
        products: true,
        vehicles: true,
      },
    });
  }

  async findByTenant(tenant: string): Promise<Company | null> {
    return this.prisma.company.findFirst({
      where: {
        OR: [
          { name: { contains: tenant, mode: 'insensitive' } },
          { id: tenant },
        ],
      },
    });
  }

  async findByNif(nif: string) {
    return this.prisma.company.findUnique({ where: { nif } });
  }

  async findByEmail(email: string) {
    return this.prisma.company.findFirst({ where: { email } });
  }

  async findWithStats(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            products: true,
            vehicles: true,
          },
        },
      },
    });
  }
}
