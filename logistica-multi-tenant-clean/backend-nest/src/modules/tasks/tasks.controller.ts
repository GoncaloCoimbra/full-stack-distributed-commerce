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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskResponseDto, TaskStatsDto } from './dto/tasks.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create nova tarefa' })
  @ApiResponse({
    status: 201,
    description: 'Tarefa criada com success',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: any,
  ): Promise<TaskResponseDto> {
    return this.tasksService.create(
      createTaskDto,
      req.user.id,
      req.user.role,
      req.user.companyId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas com filtros opcionais' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tarefas',
    type: [TaskResponseDto],
  })
  async findAll(
    @Query() filterDto: FilterTaskDto,
    @Request() req: any,
  ): Promise<TaskResponseDto[]> {
    return this.tasksService.findAll(
      filterDto,
      req.user.id,
      req.user.role,
      req.user.companyId,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get estatísticas das tarefas' })
  @ApiQuery({
    name: 'companyId',
    required: false,
    description: 'ID da company (apenas SUPER_ADMIN)',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas das tarefas',
    type: TaskStatsDto,
  })
  async getStats(
    @Query('companyId') companyId: string,
    @Request() req: any,
  ): Promise<TaskStatsDto> {
    return this.tasksService.getStats(
      req.user.id,
      req.user.role,
      req.user.companyId,
      companyId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search tarefa por ID' })
  @ApiResponse({
    status: 200,
    description: 'Tarefa encontrada',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  async findOne(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<TaskResponseDto> {
    return this.tasksService.findOne(
      id,
      req.user.id,
      req.user.role,
      req.user.companyId,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tarefa' })
  @ApiResponse({
    status: 200,
    description: 'Tarefa atualizada com success',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: any,
  ): Promise<TaskResponseDto> {
    return this.tasksService.update(
      id,
      updateTaskDto,
      req.user.id,
      req.user.role,
      req.user.companyId,
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update status da tarefa' })
  @ApiResponse({
    status: 200,
    description: 'Status atualizado com success',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTaskStatusDto,
    @Request() req: any,
  ): Promise<TaskResponseDto> {
    return this.tasksService.updateStatus(
      id,
      updateStatusDto,
      req.user.id,
      req.user.role,
      req.user.companyId,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Excluir tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa excluída com success' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.tasksService.remove(
      id,
      req.user.id,
      req.user.role,
      req.user.companyId,
    );
  }
}
