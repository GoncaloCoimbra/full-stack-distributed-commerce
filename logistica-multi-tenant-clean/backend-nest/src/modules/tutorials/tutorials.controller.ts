import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { TutorialsService } from './tutorials.service';

@ApiTags('Tutorials')
@Controller('tutorials')
export class TutorialsController {
  private readonly logger = new Logger(TutorialsController.name);

  constructor(private readonly tutorialsService: TutorialsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos os tutoriais com paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.tutorialsService.findAll(parseInt(page), parseInt(limit));
  }

  @Public()
  @Get('category/:category')
  @ApiOperation({ summary: 'Listar tutoriais por categoria' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findByCategory(
    @Param('category') category: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.tutorialsService.findByCategory(
      category,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get detalhes de um tutorial específico' })
  async findOne(@Param('id') id: string) {
    const tutorial = await this.tutorialsService.findOne(parseInt(id));
    if (!tutorial) {
      return { error: 'Tutorial não encontrado' };
    }
    return { data: tutorial };
  }
}
