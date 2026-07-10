// src/database/repositories/supplier.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Supplier } from '@prisma/client';

@Injectable()
export class SupplierRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<Supplier[]> {
    return this.prisma.supplier.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, companyId: string): Promise<Supplier | null> {
    return this.prisma.supplier.findFirst({
      where: { id, companyId },
    });
  }

  async findByNif(nif: string, companyId: string): Promise<Supplier | null> {
    return this.prisma.supplier.findFirst({
      where: { nif, companyId },
    });
  }

  async create(data: any): Promise<Supplier> {
    return this.prisma.supplier.create({ data });
  }

  async update(id: string, data: any): Promise<Supplier> {
    return this.prisma.supplier.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Supplier> {
    return this.prisma.supplier.delete({
      where: { id },
    });
  }

  async count(where: any): Promise<number> {
    return this.prisma.supplier.count({ where });
  }
}
