// src/modules/transports/dto/create-transport.dto.ts

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsUUID,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TransportStatus } from '@prisma/client';

// HELPER CLASS for products
export class TransportProductDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Product ID',
  })
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsUUID('4', { message: 'Invalid product ID' })
  productId: string;

  @ApiProperty({
    example: 50,
    description: 'Quantity to transport',
  })
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;
}

export class CreateTransportDto {
  // 🚗 VEHICLE

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Vehicle ID (UUID)',
    required: true,
  })
  @IsNotEmpty({ message: 'Vehicle is required' })
  @IsUUID('4', { message: 'Invalid vehicle ID' })
  vehicleId: string;

  // 📍 ORIGIN AND DESTINATION

  @ApiProperty({
    example: 'Lisbon',
    description: 'City/Origin location',
  })
  @IsNotEmpty({ message: 'Origin is required' })
  @IsString()
  origin: string;

  @ApiProperty({
    example: 'Porto',
    description: 'City/Destination location',
  })
  @IsNotEmpty({ message: 'Destination is required' })
  @IsString()
  destination: string;

  // 📅 DATES

  @ApiProperty({
    example: '2025-12-01',
    description: 'Departure date (YYYY-MM-DD)',
    required: true,
  })
  @IsNotEmpty({ message: 'Departure date is required' })
  @IsDateString({}, { message: 'Invalid departure date' })
  departureDate: string;

  @ApiProperty({
    example: '2025-12-05',
    description: 'Estimated arrival date (YYYY-MM-DD)',
    required: true,
  })
  @IsNotEmpty({ message: 'Arrival date is required' })
  @IsDateString({}, { message: 'Invalid arrival date' })
  estimatedArrival: string;

  // ⚖️ WEIGHT AND NOTES

  @ApiProperty({
    example: 1500.5,
    description: 'Total load weight in kg',
    required: true,
  })
  @IsNotEmpty({ message: 'Total weight is required' })
  @IsNumber({}, { message: 'Weight must be a number' })
  totalWeight: number;

  @ApiProperty({
    example: 'Fragile cargo - handle with care',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  // 📊 STATUS

  @ApiProperty({
    enum: TransportStatus,
    example: TransportStatus.PENDING,
    required: false,
    default: TransportStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(TransportStatus, { message: 'Invalid status' })
  status?: TransportStatus;

  // 🏢 COMPANY ID

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Company ID (automatically injected)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  companyId?: string;

  // 📦 productS ( new - CORRECT)

  @ApiProperty({
    type: [TransportProductDto],
    required: false,
    description: 'Products to transport with their quantities',
    example: [
      { productId: 'uuid-1', quantity: 50 },
      { productId: 'uuid-2', quantity: 30 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransportProductDto)
  products?: TransportProductDto[];
}
