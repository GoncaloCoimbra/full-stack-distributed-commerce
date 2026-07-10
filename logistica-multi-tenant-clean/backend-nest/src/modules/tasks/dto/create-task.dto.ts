import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { TaskStatus, TaskPriority } from '@prisma/client'; // ← IMPORTAR DO PRISMA

export { TaskStatus, TaskPriority }; // ← REEXPORTAR

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Implementar  new recurso',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada da tarefa',
    example: 'Implementar sistema de notificações em time real',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    description: 'Priority da tarefa',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
  })
  @IsEnum(TaskPriority)
  @IsNotEmpty()
  priority: TaskPriority;

  @ApiProperty({
    description: 'Date de vencimento da tarefa',
    example: '2026-01-15T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiProperty({
    description: 'Name do responsável pela tarefa',
    example: 'João Silva',
    required: false,
  })
  @IsString()
  @IsOptional()
  assignedTo?: string;

  @ApiProperty({
    description: 'ID da company (apenas para SUPER_ADMIN)',
    example: 'uuid-da-company',
    required: false,
  })
  @IsString()
  @IsOptional()
  companyId?: string;
}
