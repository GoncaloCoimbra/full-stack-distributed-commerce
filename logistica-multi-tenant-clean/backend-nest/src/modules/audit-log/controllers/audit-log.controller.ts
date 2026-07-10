import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLogService } from '../audit-log.service';
import { FilterAuditLogDto } from '../dto/filter-audit-log.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { TenantGuard } from '../../auth/guards/tenant.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Audit Log')
@Controller('audit-log')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@ApiBearerAuth()
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  // CLEAR ALL HISTORY (BEFORE GENERIC ROUTES)
  @Post('clear-all')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Limpar todo o histórico de auditoria (apenas ADMIN/SUPER_ADMIN)',
  })
  async clearAllLogs(@CurrentUser() user: any) {
    try {
      const deletedCount = await this.auditLogService.clearAllLogs(
        user.companyId,
      );
      console.log(
        `[Controller] Cleared ${deletedCount} audit logs for company ${user.companyId}`,
      );
      return {
        success: true,
        message: `${deletedCount} registos eliminados com success`,
        deletedCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`[Controller] Error clearing audit logs:`, error);
      throw error;
    }
  }

  //  ESTATÍSTICAS (ESPECÍFICAS)
  @Get('stats')
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Estatísticas de ações' })
  async getStats(@CurrentUser() user: any) {
    return this.auditLogService.getActionStats(user.companyId);
  }

  // LISTAR LOGS POR ENTIDADE (ESPECÍFICAS)
  @Get('entity/:entity/:entityId')
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Logs por entidade' })
  findByEntity(
    @Param('entity') entity: string,
    @Param('entityId') entityId: string,
    @CurrentUser() user: any,
  ) {
    return this.auditLogService.findByEntity(entity, entityId, user.companyId);
  }

  //  LISTAR LOGS POR UTILIZADOR (ESPECÍFICAS)
  @Get('user/:userId')
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Logs por utilizador' })
  findByUser(@Param('userId') userId: string, @CurrentUser() user: any) {
    return this.auditLogService.findByUser(userId, user.companyId);
  }

  //  ELIMINAR REGISTO INDIVIDUAL
  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete um registo de auditoria específico' })
  async deleteLog(@Param('id') id: string, @CurrentUser() user: any) {
    const success = await this.auditLogService.deleteLog(id, user.companyId);
    return {
      success,
      message: success
        ? 'Registo eliminado com success'
        : 'Registo não encontrado',
    };
  }

  //  LISTAR TODOS OS LOGS (COM PAGINAÇÃO - POR ÚLTIMO)
  @Get()
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Listar todos os logs de auditoria' })
  async findAll(@CurrentUser() user: any, @Query() filters: FilterAuditLogDto) {
    const page = parseInt(filters.page as any) || 1;
    const limit = parseInt(filters.limit as any) || 50;

    const result = await this.auditLogService.findAll(user.companyId, {
      ...filters,
      page,
      limit,
    });

    return {
      logs: result.logs,
      pagination: {
        currentPage: page,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        itemsPerPage: limit,
      },
    };
  }
}
