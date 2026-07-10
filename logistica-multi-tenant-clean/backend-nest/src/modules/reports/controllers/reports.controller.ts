import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from '../reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { TenantGuard } from '../../auth/guards/tenant.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('products')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Relat�rio dproducttos' })
  getProductsReport(@CurrentUser() user: any) {
    return this.reportsService.generateProductReport(user.companyId);
  }

  @Get('transports')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Relat�rio de transportes' })
  getTransportsReport(@CurrentUser() user: any) {
    return this.reportsService.generateTransportReport(user.companyId);
  }
}
