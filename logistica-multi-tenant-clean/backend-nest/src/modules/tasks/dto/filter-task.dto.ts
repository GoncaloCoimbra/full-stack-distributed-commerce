import {
  IsOptional,
  IsEnum,
  IsUUID,
  IsDateString,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from './create-task.dto';

export class FilterTaskDto {
  @ApiPropertyOptional({
    description: 'Filter por status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Filter por priority da tarefa',
    enum: TaskPriority,
    example: TaskPriority.HIGH,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Filter por ID da company (apenas SUPER_ADMIN)',
    example: 'uuid-da-company',
  })
  @IsUUID('4')
  @IsOptional()
  companyId?: string;

  @ApiPropertyOptional({
    description: 'Filter por responsável',
    example: 'João Silva',
  })
  @IsString()
  @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: 'Filter tarefas com vencimento até esta date',
    example: '2026-01-31',
  })
  @IsDateString()
  @IsOptional()
  dueDateBefore?: string;

  @ApiPropertyOptional({
    description: 'Filter tarefas com vencimento após esta date',
    example: '2026-01-01',
  })
  @IsDateString()
  @IsOptional()
  dueDateAfter?: string;

  @ApiPropertyOptional({
    description: 'Search por texto no título ou descrição',
    example: 'implementar',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
