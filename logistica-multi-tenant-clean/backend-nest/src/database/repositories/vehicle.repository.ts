import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Vehicle, Prisma } from '@prisma/client';

@Injectable()
export class VehicleRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany();
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({
      where: { id },
    });
  }

  async findOne(id: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({
      where: { id },
    });
  }

  async findByCompany(companyId: string): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      where: { companyId },
    });
  }

  async findByCompanyId(companyId: string): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      where: { companyId },
    });
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findFirst({
      where: { licensePlate },
    });
  }

  async findAvailable(companyId?: string): Promise<Vehicle[]> {
    const where: Prisma.VehicleWhereInput = companyId ? { companyId } : {};

    return this.prisma.vehicle.findMany({ where });
  }

  async create(data: Prisma.VehicleCreateInput): Promise<Vehicle> {
    return this.prisma.vehicle.create({ data });
  }

  async update(id: string, data: Prisma.VehicleUpdateInput): Promise<Vehicle> {
    return this.prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: any): Promise<Vehicle> {
    return this.prisma.vehicle.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string): Promise<Vehicle> {
    return this.prisma.vehicle.delete({
      where: { id },
    });
  }
}
