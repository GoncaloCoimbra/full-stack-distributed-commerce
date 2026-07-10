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
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import {
  UpdateReferralDto,
  UpdateReferralStatusDto,
} from './dto/update-referral.dto';
import { FilterReferralDto } from './dto/filter-referral.dto';
import { ReferralResponseDto, ReferralStatsDto } from './dto/referrals.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Referrals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post()
  @ApiOperation({ summary: 'Create nova referência' })
  @ApiResponse({
    status: 201,
    description: 'Referência criada com success',
    type: ReferralResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(
    @Body() createReferralDto: CreateReferralDto,
    @Request() req: any,
  ): Promise<ReferralResponseDto> {
    return this.referralsService.create(
      createReferralDto,
      req.user.id,
      req.user.role,
      req.user.companyId,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as referências com filtros opcionais',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de referências',
    type: [ReferralResponseDto],
  })
  async findAll(
    @Query() filterDto: FilterReferralDto,
    @Request() req: any,
  ): Promise<ReferralResponseDto[]> {
    return this.referralsService.findAll(
      filterDto,
      req.user.id,
      req.user.role,
      req.user.companyId,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get estatísticas das referências' })
  @ApiQuery({
    name: 'companyId',
    required: false,
    description: 'ID da company (apenas SUPER_ADMIN)',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas das referências',
    type: ReferralStatsDto,
  })
  async getStats(
    @Query('companyId') companyId: string,
    @Request() req: any,
  ): Promise<ReferralStatsDto> {
    return this.referralsService.getStats(
      req.user.id,
      req.user.role,
      req.user.companyId,
      companyId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search referência por ID' })
  @ApiResponse({
    status: 200,
    description: 'Referência encontrada',
    type: ReferralResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Referência não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  async findOne(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ReferralResponseDto> {
    return this.referralsService.findOne(
      id,
      req.user.id,
      req.user.role,
      req.user.companyId,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update referência' })
  @ApiResponse({
    status: 200,
    description: 'Referência atualizada com success',
    type: ReferralResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Referência não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  async update(
    @Param('id') id: string,
    @Body() updateReferralDto: UpdateReferralDto,
    @Request() req: any,
  ): Promise<ReferralResponseDto> {
    return this.referralsService.update(
      id,
      updateReferralDto,
      req.user.id,
      req.user.role,
      req.user.companyId,
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update status da referência' })
  @ApiResponse({
    status: 200,
    description: 'Status atualizado com success',
    type: ReferralResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Referência não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateReferralStatusDto,
    @Request() req: any,
  ): Promise<ReferralResponseDto> {
    return this.referralsService.updateStatus(
      id,
      updateStatusDto,
      req.user.id,
      req.user.role,
      req.user.companyId,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Excluir referência' })
  @ApiResponse({ status: 200, description: 'Referência excluída com success' })
  @ApiResponse({ status: 404, description: 'Referência não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.referralsService.remove(
      id,
      req.user.id,
      req.user.role,
      req.user.companyId,
    );
  }
}
