import { IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransportStatus } from '@prisma/client';

export class FilterTransportDto {
  @ApiProperty({
    enum: TransportStatus,
    required: false,
    description: 'Filter por status do transport',
  })
  @IsOptional()
  @IsEnum(TransportStatus)
  status?: TransportStatus;

  @ApiProperty({
    example: '2025-01-01',
    required: false,
    description: 'Date inicial (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    example: '2025-12-31',
    required: false,
    description: 'Date final (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    required: false,
    description: 'Filter por ID do Vehicle (UUID)',
  })
  @IsOptional()
  @IsUUID('4', { message: 'VehicleId deve ser um UUID válido' })
  vehicleId?: string;
}
