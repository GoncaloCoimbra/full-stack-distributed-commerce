// src/modules/vehicles/dto/create-vehicle.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { VehicleStatus } from '@prisma/client';

export class CreateVehicleDto {
  @ApiProperty({ example: 'AB-12-CD' })
  @IsNotEmpty({ message: 'License plate is required' })
  @IsString()
  @Transform(({ value }) => value?.trim().toUpperCase())
  licensePlate: string;

  @ApiProperty({ example: 'Sprinter 415' })
  @IsNotEmpty({ message: 'Model is required' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  model: string;

  @ApiProperty({ example: 'Mercedes-Benz' })
  @IsNotEmpty({ message: 'Brand is required' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  brand: string;

  @ApiProperty({
    example: 'truck',
    description: 'Vehicle type: truck, van, car, etc',
  })
  @IsNotEmpty({ message: 'Type is required' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  type: string;

  @ApiProperty({ example: 3500, description: 'Capacity in kg' })
  @IsNotEmpty({ message: 'Capacity is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Capacity must be a number' })
  @Min(1, { message: 'Capacity must be greater than 0' })
  capacity: number;

  @ApiProperty({ example: 2023 })
  @IsNotEmpty({ message: 'Year is required' })
  @Type(() => Number)
  @IsInt({ message: 'Year must be an integer' })
  @Min(1900, { message: 'Year must be at least 1900' })
  @Max(new Date().getFullYear() + 1, {
    message: `Year must be at most ${new Date().getFullYear() + 1}`,
  })
  year: number;

  @ApiProperty({
    example: 'available',
    enum: VehicleStatus,
    description: 'Vehicle status',
    required: false,
  })
  @IsOptional()
  @IsEnum(VehicleStatus, {
    message: `Status must be one of: ${Object.values(VehicleStatus).join(', ')}`,
  })
  status?: VehicleStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}
