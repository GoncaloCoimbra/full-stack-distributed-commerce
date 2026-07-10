import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from '../companies.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { TenantGuard } from '../../auth/guards/tenant.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { Role } from '@prisma/client';

/**
 * COMPANIES CONTROLLER
 *
 * Routes for company management:
 * - SUPER_ADMIN: Full access to all routes (does NOT use TenantGuard)
 * - ADMIN: Limited access to their own company only (uses TenantGuard)
 * - OPERATOR: Read-only access to their own company info
 * - PUBLIC: /companies/public endpoint for operator registration
 */
@ApiTags('Companies')
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CompaniesController {
  private readonly logger = new Logger(CompaniesController.name);

  constructor(private readonly companiesService: CompaniesService) {}

  /**
   * GET /companies/public
   * PUBLIC ROUTE - For operators to select a company during registration
   * Returns only: id, name, nif (no sensitive data)
   */
  @Public()
  @Get('public')
  @ApiOperation({
    summary: 'List active companies (public - for registration)',
    description:
      'Public endpoint returning basic company list for operator registration',
  })
  async findPublic() {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`GET /companies/public (PUBLIC)`);

    const companies = await this.companiesService.findAll();

    const publicCompanies = companies
      .filter((company) => company.isActive)
      .map((company) => ({
        id: company.id,
        name: company.name,
        nif: company.nif,
      }));

    this.logger.log(
      `✅ ${publicCompanies.length} active companies returned (public)`,
    );
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return publicCompanies;
  }

  /**
   * POST /companies
   * Create a new company (SUPER_ADMIN only)
   */
  @Post()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new company (SUPER_ADMIN)' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`POST /companies`);
    this.logger.log(`Data: ${JSON.stringify(createCompanyDto)}`);

    const result = this.companiesService.create(createCompanyDto);

    this.logger.log(`✅ Company created successfully`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return result;
  }

  /**
   * GET /companies
   * List companies:
   * - SUPER_ADMIN: All companies
   * - ADMIN: Only their own company
   */
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'List companies' })
  async findAll(@Request() req) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(
      `GET /companies - User: ${req.user.email} (${req.user.role})`,
    );

    if (req.user.role === Role.SUPER_ADMIN) {
      this.logger.log(`SUPER_ADMIN - Returning ALL companies`);
      const companies = await this.companiesService.findAll();
      this.logger.log(`✅ ${companies.length} companies returned`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      return companies;
    }

    if (!req.user.companyId) {
      this.logger.error(`❌ ADMIN without companyId`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      throw new BadRequestException('User has no associated company');
    }

    this.logger.log(`ADMIN - Returning only company: ${req.user.companyId}`);
    const company = await this.companiesService.findOne(req.user.companyId);
    this.logger.log(`✅ Company returned: ${company.name}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return [company];
  }

  /**
   * ⚠️ GET /companies/info — MUST come BEFORE @Get(':id') to avoid route conflict
   * Get current user's company information (ADMIN and OPERATOR)
   */
  @Get('info')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Get current company info (ADMIN, OPERATOR)' })
  async getCompanyInfo(@Request() req) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(
      `GET /companies/info - User: ${req.user.email} (${req.user.role})`,
    );

    if (!req.user.companyId) {
      this.logger.error(`❌ User has no companyId`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      throw new BadRequestException('User has no associated company');
    }

    const company = await this.companiesService.findOne(req.user.companyId);

    this.logger.log(`✅ Company info returned: ${company.name}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return company;
  }

  /**
   * GET /companies/:id
   * Get company by ID:
   * - SUPER_ADMIN: Any company
   * - ADMIN: Only their own company
   */
  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Get company by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(
      `GET /companies/${id} - User: ${req.user.email} (${req.user.role})`,
    );

    if (req.user.role === Role.ADMIN && req.user.companyId !== id) {
      this.logger.error(
        `❌ ADMIN ${req.user.email} tried to access company ${id}`,
      );
      this.logger.error(`   ADMIN's company: ${req.user.companyId}`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      throw new BadRequestException('Cannot access data from another company');
    }

    const company = await this.companiesService.findOne(id);

    this.logger.log(`✅ Company returned: ${company.name}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return company;
  }

  /**
   * GET /companies/:id/users
   * Get company users:
   * - SUPER_ADMIN: Any company
   * - ADMIN: Only their own company
   */
  @Get(':id/users')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Get company with users' })
  async findWithUsers(@Param('id') id: string, @Request() req) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`GET /companies/${id}/users - User: ${req.user.email}`);

    if (req.user.role === Role.ADMIN && req.user.companyId !== id) {
      this.logger.error(`❌ ADMIN tried to access users of company ${id}`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      throw new BadRequestException('Cannot access data from another company');
    }

    const company = await this.companiesService.findWithUsers(id);

    this.logger.log(`✅ ${company.users?.length || 0} users returned`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return company;
  }

  /**
   * GET /companies/:id/stats
   * Get company statistics:
   * - SUPER_ADMIN: Any company
   * - ADMIN: Only their own company
   */
  @Get(':id/stats')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Get company statistics' })
  async findWithStats(@Param('id') id: string, @Request() req) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`GET /companies/${id}/stats - User: ${req.user.email}`);

    if (req.user.role === Role.ADMIN && req.user.companyId !== id) {
      this.logger.error(`❌ ADMIN tried to access stats of company ${id}`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      throw new BadRequestException('Cannot access data from another company');
    }

    const stats = await this.companiesService.findWithStats(id);

    this.logger.log(`✅ Stats returned`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return stats;
  }

  /**
   * PATCH /companies/:id
   * Update company:
   * - SUPER_ADMIN: Any company
   * - ADMIN: Only their own company
   */
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Update company' })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() req,
  ) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`PATCH /companies/${id} - User: ${req.user.email}`);
    this.logger.log(`Data: ${JSON.stringify(updateCompanyDto)}`);

    if (req.user.role === Role.ADMIN && req.user.companyId !== id) {
      this.logger.error(`❌ ADMIN tried to update company ${id}`);
      this.logger.error(`   ADMIN's company: ${req.user.companyId}`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      throw new BadRequestException('Cannot update another company');
    }

    const updated = await this.companiesService.update(id, updateCompanyDto);

    this.logger.log(`✅ Company updated: ${updated.name}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return updated;
  }

  /**
   * DELETE /companies/:id
   * Delete company (SUPER_ADMIN only)
   */
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete company (SUPER_ADMIN)' })
  async remove(@Param('id') id: string) {
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`DELETE /companies/${id}`);

    await this.companiesService.remove(id);

    this.logger.log(`✅ Company deleted successfully`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return { message: 'Company deleted successfully' };
  }
}
