// src/modules/suppliers/suppliers.service.ts

import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier, ProductStatus } from '@prisma/client';
import { SerializedSupplier } from './interfaces/supplier.interface';

@Injectable()
export class SuppliersService {
  private readonly logger = new Logger(SuppliersService.name);

  constructor(private prisma: PrismaService) {}

  async create(
    createSupplierDto: CreateSupplierDto,
    companyId: string,
  ): Promise<SerializedSupplier> {
    try {
      this.logger.log(`📝 Criando supplier para company: ${companyId}`);

      const existing = await this.prisma.supplier.findFirst({
        where: {
          nif: createSupplierDto.nif,
          companyId,
        },
      });

      if (existing) {
        throw new ConflictException('Already exists um supplier com este NIF');
      }

      const supplier = await this.prisma.supplier.create({
        data: {
          name: createSupplierDto.name,
          nif: createSupplierDto.nif,
          email: createSupplierDto.email || null,
          phone: createSupplierDto.phone || null,
          address: createSupplierDto.address || null,
          city: createSupplierDto.city || null,
          state: createSupplierDto.state || null,
          companyId,
        },
      });

      this.logger.log(` Supplier criado: ${supplier.name} (${supplier.id})`);
      return this.serialize(supplier);
    } catch (error) {
      this.logger.error(' Error ao create supplier:', error.message);
      throw error;
    }
  }

  async findAll(
    companyId?: string,
    search?: string,
  ): Promise<SerializedSupplier[]> {
    try {
      this.logger.log(`🔍 [SERVICE] Buscando fornecedores`);
      this.logger.log(
        `🔍 [SERVICE] CompanyId: ${companyId || 'TODAS (SUPER_ADMIN)'}`,
      );

      const where: any = {};

      if (companyId) {
        where.companyId = companyId;
      }

      if (search?.trim()) {
        const s = search.trim();
        where.OR = [
          { name: { contains: s, mode: 'insensitive' } },
          { nif: { contains: s, mode: 'insensitive' } },
        ];
      }

      const suppliers = await this.prisma.supplier.findMany({
        where,
        orderBy: { name: 'asc' },
      });

      this.logger.log(
        ` [SERVICE] Encontrados: ${suppliers.length} fornecedores`,
      );
      return suppliers.map((s) => this.serialize(s));
    } catch (error) {
      this.logger.error(
        ` [SERVICE] ERRO ao search fornecedores: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Error ao search fornecedores: ${error.message}`,
      );
    }
  }

  private serialize(supplier: Supplier): SerializedSupplier {
    try {
      return {
        id: supplier.id || '',
        name: supplier.name || '',
        nif: supplier.nif || '',
        email: supplier.email || null,
        phone: supplier.phone || null,
        address: supplier.address || null,
        city: supplier.city || null,
        state: supplier.state || null,
        companyId: supplier.companyId || '',
        createdAt: supplier.createdAt
          ? supplier.createdAt instanceof Date
            ? supplier.createdAt.toISOString()
            : String(supplier.createdAt)
          : new Date().toISOString(),
        updatedAt: supplier.updatedAt
          ? supplier.updatedAt instanceof Date
            ? supplier.updatedAt.toISOString()
            : String(supplier.updatedAt)
          : new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        ` Error ao serializar supplier ${supplier?.id}: ${error.message}`,
      );
      throw error;
    }
  }

  async findOne(id: string, companyId?: string): Promise<SerializedSupplier> {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`🔍 Buscando supplier ${id}`);
    this.logger.log(`🏢 CompanyId: ${companyId || 'TODAS (SUPER_ADMIN)'}`);

    const where: any = { id };

    if (companyId) {
      where.companyId = companyId;
    }

    this.logger.log(`📝 Query where: ${JSON.stringify(where)}`);

    const supplier = await this.prisma.supplier.findFirst({ where });

    if (!supplier) {
      this.logger.error(` Supplier ${id} não encontrado`);
      throw new NotFoundException('Supplier não encontrado');
    }

    this.logger.log(` Supplier encontrado: ${supplier.name}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return this.serialize(supplier);
  }

  async findByVehicle(
    vehicleId: string,
    companyId?: string,
  ): Promise<SerializedSupplier[]> {
    this.logger.log(`🔍 Buscando fornecedores por Vehicle ${vehicleId}`);

    const where: any = {};
    if (companyId) {
      where.companyId = companyId;
    }

    const suppliers = await this.prisma.supplier.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    return suppliers.map((s) => this.serialize(s));
  }

  async findWithProducts(id: string, companyId?: string) {
    this.logger.log(`🔍 Searching for supplier ${id} with products`);
    const supplier = await this.findOne(id, companyId);

    const where: any = { supplierId: id };
    if (companyId) {
      where.companyId = companyId;
    }

    const products = await this.prisma.product.findMany({ where });

    return { ...supplier, products };
  }

  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
    companyId?: string,
  ): Promise<SerializedSupplier> {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`📝 Updating supplier ${id}`);
    this.logger.log(`🏢 CompanyId: ${companyId || 'TODAS (SUPER_ADMIN)'}`);
    this.logger.log(`📋 DTO: ${JSON.stringify(updateSupplierDto)}`);

    // Busca o supplier
    const supplier = await this.findOne(id, companyId);
    this.logger.log(` Supplier encontrado para atualização: ${supplier.name}`);

    // Validate NIF único se estiver sendo alterado
    if (updateSupplierDto.nif && updateSupplierDto.nif !== supplier.nif) {
      this.logger.log(
        `🔍 Verificando se NIF ${updateSupplierDto.nif} já existe...`,
      );

      const where: any = {
        nif: updateSupplierDto.nif,
        NOT: { id },
      };

      if (companyId) {
        where.companyId = companyId;
      }

      const existing = await this.prisma.supplier.findFirst({ where });

      if (existing) {
        this.logger.error(` NIF ${updateSupplierDto.nif} já existe`);
        throw new ConflictException('Already exists um supplier com este NIF');
      }

      this.logger.log(` NIF disponível`);
    }

    // Update apenas os campos fornecidos
    const updateData: any = {};

    if (updateSupplierDto.name !== undefined)
      updateData.name = updateSupplierDto.name;
    if (updateSupplierDto.nif !== undefined)
      updateData.nif = updateSupplierDto.nif;
    if (updateSupplierDto.email !== undefined)
      updateData.email = updateSupplierDto.email;
    if (updateSupplierDto.phone !== undefined)
      updateData.phone = updateSupplierDto.phone;
    if (updateSupplierDto.address !== undefined)
      updateData.address = updateSupplierDto.address;
    if (updateSupplierDto.city !== undefined)
      updateData.city = updateSupplierDto.city;
    if (updateSupplierDto.state !== undefined)
      updateData.state = updateSupplierDto.state;

    this.logger.log(`📝 Dados para atualização: ${JSON.stringify(updateData)}`);

    const updated = await this.prisma.supplier.update({
      where: { id },
      data: updateData,
    });

    this.logger.log(` Supplier ${id} atualizado com success`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return this.serialize(updated);
  }

  async remove(id: string, companyId?: string): Promise<{ message: string }> {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`🗑️ Tentando remove supplier ${id}`);
    this.logger.log(`🏢 CompanyId: ${companyId || 'TODAS (SUPER_ADMIN)'}`);

    try {
      // 1️⃣ Busca o supplier
      const supplier = await this.findOne(id, companyId);
      this.logger.log(` Supplier encontrado: ${supplier.name}`);

      // 2️⃣ Checks products with ADVANCED status (not RECEIVED)
      const advancedProducts = await this.prisma.product.findMany({
        where: {
          supplierId: id,
          status: {
            notIn: [ProductStatus.RECEIVED],
          },
        },
        select: {
          internalCode: true,
          description: true,
          status: true,
        },
        take: 5,
      });

      this.logger.log(
        `📦 Products with advanced status: ${advancedProducts.length}`,
      );

      // ⚠️ SE TIVER productS EM ESTADOS AVANÇADOS → NÃO PODE ELIMINAR
      if (advancedProducts.length > 0) {
        this.logger.warn(
          `⚠️ BLOQUEADO - Supplier tem ${advancedProducts.length} product(s) em estado avançado`,
        );

        const productsList = advancedProducts
          .map(
            (p) => `${p.internalCode} - ${p.description} (Status: ${p.status})`,
          )
          .join(', ');

        throw new ConflictException(
          ` Não é possível delete este supplier pois tem products em estados avançados.\n\n` +
            `📦 products em processo (${advancedProducts.length}):\n${productsList}${advancedProducts.length > 5 ? '...' : ''}\n\n` +
            `💡 Pode delete o supplier quando:\n` +
            `  • Todos os products estiverem com status RECEIVED\n` +
            `  • Delete ou transferir os products para outro supplier`,
        );
      }

      // 3️⃣ Verifica products com status RECEIVED
      const receivedProductsCount = await this.prisma.product.count({
        where: {
          supplierId: id,
          status: ProductStatus.RECEIVED,
        },
      });

      this.logger.log(`📦 products apenas recebidos: ${receivedProductsCount}`);

      //  SE SÓ TIVER productS RECEIVED OU NENHUM → PODE ELIMINAR
      if (receivedProductsCount > 0) {
        this.logger.log(
          `ℹ️ O supplier tem ${receivedProductsCount} product(s) apenas recebido(s), mas pode ser eliminado`,
        );
        this.logger.log(
          `🔄 Estes products poderão ser reassociados a outro supplier se necessário`,
        );
      } else {
        this.logger.log(
          ` Nenhum product associado - prosseguindo com eliminação`,
        );
      }

      // 4️⃣ Delete o supplier
      await this.prisma.supplier.delete({
        where: { id },
      });

      this.logger.log(
        ` Supplier "${supplier.name}" (${id}) eliminado com success`,
      );
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      return {
        message: ` Supplier "${supplier.name}" eliminado com success`,
        ...(receivedProductsCount > 0 && {
          warning: `ℹ️ Existiam ${receivedProductsCount} product(s) apenas recebido(s) que foram desassociados`,
        }),
      };
    } catch (error) {
      // Se já é uma exceção conhecida, propaga
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      // Log de error inesperado
      this.logger.error(` Error inesperado ao delete supplier ${id}`);
      this.logger.error(`Mensagem: ${error.message}`);
      this.logger.error(`Stack: ${error.stack}`);

      throw new InternalServerErrorException(
        `Error ao delete supplier: ${error.message}`,
      );
    }
  }
}
