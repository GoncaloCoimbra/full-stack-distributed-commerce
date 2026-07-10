// src/modules/vehicles/controllers/vehicles.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Logger,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesService } from '../vehicles.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { TenantGuard } from '../../auth/guards/tenant.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role, VehicleStatus } from '@prisma/client';

@ApiTags('Vehicles')
@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@ApiBearerAuth()
export class VehiclesController {
  private readonly logger = new Logger(VehiclesController.name);

  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create new vehicle' })
  async create(@Body() createVehicleDto: CreateVehicleDto, @Request() req) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(
      `📥 POST /vehicles - User: ${req.user.email}, Role: ${req.user.role}`,
    );
    this.logger.log(`🏢 CompanyId: ${req.user.companyId || 'SUPER_ADMIN'}`);

    const companyId = createVehicleDto.companyId || req.user.companyId;

    if (!companyId) {
      this.logger.error(` CompanyId not found!`);
      throw new BadRequestException('CompanyId is required');
    }

    this.logger.log(`Validation passed, creating vehicle...`);

    const result = await this.vehiclesService.create(
      createVehicleDto,
      companyId,
    );

    this.logger.log(`Vehicle created successfully: ${result.id}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return result;
  }

  @Get()
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'List vehicles' })
  async findAll(@Request() req, @Query() filters?: any) {
    this.logger.log(
      `📥 GET /vehicles - User: ${req.user.email} (${req.user.role})`,
    );

    const companyId =
      req.user.role === Role.SUPER_ADMIN
        ? filters?.companyId
        : req.user.companyId;

    this.logger.log(`🏢 CompanyId: ${companyId || 'TODAS'}`);

    return this.vehiclesService.findAll(companyId, filters);
  }

  @Get('available')
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'List available vehicles' })
  async findAvailable(
    @Request() req,
    @Query('companyId') queryCompanyId?: string,
  ) {
    this.logger.log(`📥 GET /vehicles/available - User: ${req.user.email}`);

    const companyId =
      req.user.role === Role.SUPER_ADMIN ? queryCompanyId : req.user.companyId;

    return this.vehiclesService.findAvailable(companyId);
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Vehicle statistics' })
  async getStats(@Request() req, @Query('companyId') queryCompanyId?: string) {
    this.logger.log(`📥 GET /vehicles/stats - User: ${req.user.email}`);

    const companyId =
      req.user.role === Role.SUPER_ADMIN ? queryCompanyId : req.user.companyId;

    return this.vehiclesService.getStats(companyId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get vehicle by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    this.logger.log(`📥 GET /vehicles/${id} - User: ${req.user.email}`);

    const companyId =
      req.user.role === Role.SUPER_ADMIN ? undefined : req.user.companyId;

    return this.vehiclesService.findOne(id, companyId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update vehicle' })
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Request() req,
  ) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`📥 PATCH /vehicles/${id} - User: ${req.user.email}`);
    this.logger.log(`🏢 CompanyId do user: ${req.user.companyId}`);

    const companyId =
      req.user.role === Role.SUPER_ADMIN ? undefined : req.user.companyId;

    const result = await this.vehiclesService.update(
      id,
      updateVehicleDto,
      companyId,
    );

    this.logger.log(`Vehicle ${id} updated successfully`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return result;
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update vehicle status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @Request() req,
  ) {
    this.logger.log(`📥 PATCH /vehicles/${id}/status - Status: ${body.status}`);

    if (!Object.values(VehicleStatus).includes(body.status as VehicleStatus)) {
      throw new BadRequestException(
        `Invalid status. Valid values: ${Object.values(VehicleStatus).join(', ')}`,
      );
    }

    const status = body.status as VehicleStatus;
    const companyId =
      req.user.role === Role.SUPER_ADMIN ? undefined : req.user.companyId;

    return this.vehiclesService.updateStatus(id, status, companyId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete vehicle' })
  async remove(@Param('id') id: string, @Request() req) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`📥 DELETE /vehicles/${id} - User: ${req.user.email}`);
    this.logger.log(`🏢 CompanyId do user: ${req.user.companyId}`);

    const companyId =
      req.user.role === Role.SUPER_ADMIN ? undefined : req.user.companyId;

    const result = await this.vehiclesService.remove(id, companyId);

    this.logger.log(`Vehicle ${id} deleted successfully`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return result;
  }
}
