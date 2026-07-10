import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from './create-task.dto';

export class TaskResponseDto {
  @ApiProperty({ description: 'ID único da tarefa', example: 'uuid-da-tarefa' })
  id: string;

  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Implementar  new recurso',
  })
  title: string;

  @ApiProperty({
    description: 'Descrição da tarefa',
    example: 'Implementar sistema de notificações',
  })
  description: string;

  @ApiProperty({
    description: 'Status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Priority da tarefa',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @ApiProperty({
    description: 'Date de vencimento',
    example: '2026-01-15T00:00:00.000Z',
  })
  dueDate: Date;

  @ApiProperty({
    description: 'Name do responsável',
    example: 'João Silva',
    nullable: true,
  })
  assignedTo: string | null;

  @ApiProperty({
    description: 'Date de criação',
    example: '2026-01-06T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date da última atualização',
    example: '2026-01-06T10:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({ description: 'Company ID', example: 'uuid-company' })
  companyId: string;

  @ApiProperty({
    description: 'ID of the user who created the task',
    example: 'uuid-user',
  })
  createdById: string;
}

export class TaskStatsDto {
  @ApiProperty({ description: 'Total de tarefas', example: 42 })
  total: number;

  @ApiProperty({ description: 'Tarefas pendentes', example: 15 })
  pending: number;

  @ApiProperty({ description: 'Tarefas em progresso', example: 10 })
  inProgress: number;

  @ApiProperty({ description: 'Tarefas concluídas', example: 15 })
  completed: number;

  @ApiProperty({ description: 'Tarefas canceladas', example: 2 })
  cancelled: number;

  @ApiProperty({ description: 'Tarefas urgentes', example: 5 })
  urgent: number;

  @ApiProperty({ description: 'Tarefas atrasadas', example: 3 })
  overdue: number;
}
