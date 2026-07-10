import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperadminService {
  constructor(private prisma: PrismaService) {}

  async getGlobalStats() {
    try {
      const [
        totalCompanies,
        totalUsers,
        totalProducts,
        totalSuppliers,
        totalVehicles,
      ] = await Promise.all([
        this.prisma.company.count(),
        this.prisma.user.count(),
        this.prisma.product.count(),
        this.prisma.supplier.count(),
        this.prisma.vehicle.count(),
      ]);

      const topCompanies = await this.prisma.company.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              users: true,
              products: true,
              suppliers: true,
            },
          },
        },
        orderBy: {
          products: {
            _count: 'desc',
          },
        },
      });

      return {
        totalCompanies,
        totalUsers,
        totalProducts,
        totalSuppliers,
        totalVehicles,
        topCompanies,
      };
    } catch (error) {
      console.error('Error fetching global statistics:', error);
      throw error;
    }
  }

  async getAllCompanies() {
    return this.prisma.company.findMany({
      include: {
        _count: {
          select: {
            users: true,
            products: true,
            vehicles: true,
            suppliers: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCompany(data: any) {
    const { adminUser, ...companyData } = data;

    const company = await this.prisma.company.create({
      data: companyData,
    });

    if (adminUser) {
      const hashedPassword = await bcrypt.hash(adminUser.password, 10);
      await this.prisma.user.create({
        data: {
          ...adminUser,
          password: hashedPassword,
          role: 'ADMIN',
          companyId: company.id,
        },
      });
    }

    return company;
  }

  async getCompany(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        users: true,
        _count: {
          select: {
            products: true,
            vehicles: true,
            suppliers: true,
            transports: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return company;
  }

  async updateCompany(id: string, data: any) {
    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async deleteCompany(id: string) {
    return this.prisma.company.delete({
      where: { id },
    });
  }

  async getCompanyStats(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        _count: {
          select: {
            users: true,
            products: true,
            suppliers: true,
            vehicles: true,
            transports: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return {
      company: {
        id: company.id,
        name: company.name,
        nif: company.nif,
        // isActive será retornado automaticamente se existir
      },
      stats: company._count,
    };
  }

  async toggleCompanyStatus(id: string, isActive: boolean) {
    // Usa any para contornar o problema de tipos temporariamente
    return this.prisma.company.update({
      where: { id },
      data: { isActive } as any,
    });
  }
}
