import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SuperadminService } from '../superadmin.service';

@Controller('superadmin')
export class SuperAdminController {
  // ← Mudei aqui de SuperadminController para SuperAdminController
  constructor(private readonly superadminService: SuperadminService) {}

  @Get('stats')
  async getGlobalStats() {
    return this.superadminService.getGlobalStats();
  }

  @Get('companies')
  async getAllCompanies() {
    return this.superadminService.getAllCompanies();
  }

  @Get('companies/:id')
  async getCompany(@Param('id') id: string) {
    return this.superadminService.getCompany(id);
  }

  @Get('companies/:id/stats')
  async getCompanyStats(@Param('id') id: string) {
    return this.superadminService.getCompanyStats(id);
  }

  @Post('companies')
  async createCompany(@Body() data: any) {
    return this.superadminService.createCompany(data);
  }

  @Patch('companies/:id')
  async updateCompany(@Param('id') id: string, @Body() data: any) {
    return this.superadminService.updateCompany(id, data);
  }

  @Patch('companies/:id/status')
  async toggleCompanyStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.superadminService.toggleCompanyStatus(id, isActive);
  }

  @Delete('companies/:id')
  async deleteCompany(@Param('id') id: string) {
    return this.superadminService.deleteCompany(id);
  }
}
