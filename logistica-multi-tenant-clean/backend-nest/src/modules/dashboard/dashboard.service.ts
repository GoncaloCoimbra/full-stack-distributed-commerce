// src/modules/dashboard/dashboard.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DashboardFiltersDto } from './dto/dashboard-filters.dto';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retorna TODAS as estatísticas necessárias para o Dashboard
   * Funciona para SUPER_ADMIN (sem companyId) e ADMIN/OPERATOR (com companyId)
   */
  async getStats(companyId?: string) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(
      ` Getting stats for company: ${companyId || 'ALL (SUPER_ADMIN)'}`,
    );

    // Cria where apenas se companyId existir
    const where: any = {};
    if (companyId) {
      where.companyId = companyId;
    }

    this.logger.log(` Where query: ${JSON.stringify(where)}`);

    try {
      // 1. CONTAGENS BÁSICAS (para os cards principais)

      const [
        totalProducts,
        totalSuppliers,
        totalVehicles,
        totalTransports,
        vehiclesAvailable,
        productsInStorage,
      ] = await Promise.all([
        this.prisma.product.count({ where }),
        this.prisma.supplier.count({ where }),
        this.prisma.vehicle.count({ where }),
        this.prisma.transport.count({ where }),
        this.prisma.vehicle.count({
          where: { ...where, status: 'available' },
        }),
        this.prisma.product.count({
          where: { ...where, status: ProductStatus.IN_STORAGE },
        }),
      ]);

      // 2. PRODUCTS BY STATUS (for pie chart)

      const productsByStatusRaw = await this.prisma.product.groupBy({
        by: ['status'],
        where,
        _count: true,
      });

      const productsByStatus = productsByStatusRaw.map((p) => ({
        status: p.status,
        count: p._count,
      }));

      // 3. SUMMARY DETALHADO (para cards e gráfico de barras)

      // Os status disponíveis no Prisma são:
      // RECEIVED, IN_ANALYSIS, IN_STORAGE, APPROVED, DISPATCHED

      const summary = {
        received: await this.prisma.product.count({
          where: { ...where, status: ProductStatus.RECEIVED },
        }),
        inAnalysis: await this.prisma.product.count({
          where: { ...where, status: ProductStatus.IN_ANALYSIS },
        }),
        inStorage: productsInStorage,
        delivered: await this.prisma.product.count({
          where: { ...where, status: ProductStatus.DISPATCHED }, // DISPATCHED = entregue
        }),
        rejected: 0, // REJECTED não existe - deixar como 0 ou create lógica customizada
      };

      // 4. PERCENTAGENS (para mostrar nos cards)

      const percentages = {
        received:
          totalProducts > 0
            ? ((summary.received / totalProducts) * 100).toFixed(1)
            : '0',
        inStorage:
          totalProducts > 0
            ? ((summary.inStorage / totalProducts) * 100).toFixed(1)
            : '0',
        delivered:
          totalProducts > 0
            ? ((summary.delivered / totalProducts) * 100).toFixed(1)
            : '0',
        rejected:
          totalProducts > 0
            ? ((summary.rejected / totalProducts) * 100).toFixed(1)
            : '0',
      };

      // 5. TOP 5 FORNECEDORES (para a seção inferior)

      const suppliersWithProducts = await this.prisma.supplier.findMany({
        where,
        include: {
          products: {
            select: { id: true },
            where: companyId ? { companyId } : {}, // Filter products by company
          },
        },
      });

      const topSuppliers = suppliersWithProducts
        .map((s) => ({
          id: s.id,
          name: s.name,
          productCount: s.products.length,
        }))
        .filter((s) => s.productCount > 0) // Remove suppliers without products
        .sort((a, b) => b.productCount - a.productCount)
        .slice(0, 5);

      // 6. MOVIMENTAÇÕES RECENTES (Last 30 days)

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentMovements = await this.prisma.product.count({
        where: {
          ...where,
          updatedAt: {
            gte: thirtyDaysAgo,
          },
        },
      });

      // 7. MONTA RESPOSTA COMPLETA

      const result = {
        totalProducts,
        totalSuppliers,
        totalVehicles,
        totalTransports,
        vehiclesAvailable,
        productsInStorage,
        productsByStatus,
        summary,
        percentages,
        topSuppliers,
        recentMovements,
      };

      // 8. LOGS DE DEBUG

      this.logger.log(`Stats computed successfully:`);
      this.logger.log(`    Total Products: ${totalProducts}`);
      this.logger.log(`   🏢 Total Suppliers: ${totalSuppliers}`);
      this.logger.log(`   🚗 Total Vehicles: ${totalVehicles}`);
      this.logger.log(`   🚚 Total Transports: ${totalTransports}`);
      this.logger.log(`   Vehicles Available: ${vehiclesAvailable}`);
      this.logger.log(`    Products In Storage: ${productsInStorage}`);
      this.logger.log(
        `    Products by Status: ${productsByStatus.length} categories`,
      );
      this.logger.log(`    Summary - Received: ${summary.received}`);
      this.logger.log(`    Summary - In Analysis: ${summary.inAnalysis}`);
      this.logger.log(`    Summary - In Storage: ${summary.inStorage}`);
      this.logger.log(
        `    Summary - Delivered (Dispatched): ${summary.delivered}`,
      );
      this.logger.log(`    Summary - Rejected: ${summary.rejected}`);
      this.logger.log(`   🔝 Top Suppliers: ${topSuppliers.length}`);
      this.logger.log(`   🔄 Recent Movements (30d): ${recentMovements}`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      return result;
    } catch (error) {
      this.logger.error(` Error computing stats: ${error.message}`);
      this.logger.error(` Stack: ${error.stack}`);
      throw error;
    }
  }

  /**
   * Dashboard overview with filters
   */
  async getOverview(companyId?: string, filters?: DashboardFiltersDto) {
    this.logger.log(` Getting overview for company: ${companyId || 'ALL'}`);

    const where: any = {};
    if (companyId) {
      where.companyId = companyId;
    }

    return {
      message: 'Dashboard overview',
      companyId: companyId || 'ALL',
      filters,
    };
  }

  /**
   * Products grouped by status
   */
  async getProductsByStatus(companyId?: string) {
    this.logger.log(
      ` Getting products by status for company: ${companyId || 'ALL'}`,
    );

    const where: any = {};
    if (companyId) {
      where.companyId = companyId;
    }

    const products = await this.prisma.product.groupBy({
      by: ['status'],
      where,
      _count: true,
    });

    return products.map((p) => ({
      status: p.status,
      count: p._count,
    }));
  }

  /**
   * Transportes agrupados por status
   */
  async getTransportsByStatus(companyId?: string) {
    this.logger.log(
      ` Getting transports by status for company: ${companyId || 'ALL'}`,
    );

    const where: any = {};
    if (companyId) {
      where.companyId = companyId;
    }

    const transports = await this.prisma.transport.groupBy({
      by: ['status'],
      where,
      _count: true,
    });

    return transports.map((t) => ({
      status: t.status,
      count: t._count,
    }));
  }

  /**
   * Atividade recente (últimos 10 logs)
   */
  async getRecentActivity(companyId?: string) {
    this.logger.log(
      ` Getting recent activity for company: ${companyId || 'ALL'}`,
    );

    const where: any = {};
    if (companyId) {
      where.companyId = companyId;
    }

    const logs = await this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return logs;
  }

  /**
   * Estatísticas mensais
   */
  async getMonthlyStats(companyId?: string) {
    this.logger.log(
      ` Getting monthly stats for company: ${companyId || 'ALL'}`,
    );

    const where: any = {};
    if (companyId) {
      where.companyId = companyId;
    }

    return {
      message: 'Estatísticas mensais',
      companyId: companyId || 'ALL',
      data: [],
    };
  }

  /**
   * Top suppliers (with most products)
   */
  async getTopSuppliers(companyId?: string) {
    this.logger.log(
      ` Getting top suppliers for company: ${companyId || 'ALL'}`,
    );

    const where: any = {};
    if (companyId) {
      where.companyId = companyId;
    }

    const suppliers = await this.prisma.supplier.findMany({
      where,
      include: {
        products: {
          select: { id: true },
          where: companyId ? { companyId } : {},
        },
      },
    });

    return suppliers
      .map((s) => ({
        id: s.id,
        name: s.name,
        nif: s.nif,
        productCount: s.products.length,
      }))
      .filter((s) => s.productCount > 0)
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 5);
  }
}
