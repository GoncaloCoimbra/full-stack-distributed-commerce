import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskStatus, TaskPriority } from '@prisma/client'; // ← IMPORTAR DO PRISMA

export class UpdateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Implementar  new recurso',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Descrição da tarefa',
    example: 'Implementar sistema de notificações',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    description: 'Priority da tarefa',
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    required: false,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({
    description: 'Date de vencimento',
    example: '2026-01-20T00:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({
    description: 'Name do responsável',
    example: 'Maria Santos',
    required: false,
  })
  @IsString()
  @IsOptional()
  assignedTo?: string;
}

export class UpdateTaskStatusDto {
  @ApiProperty({
    description: ' new status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.COMPLETED,
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
