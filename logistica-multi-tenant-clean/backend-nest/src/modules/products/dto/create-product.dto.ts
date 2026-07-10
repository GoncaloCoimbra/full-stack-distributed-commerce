import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ example: 'PROD-001' })
  @IsNotEmpty({ message: 'Internal code is required' })
  @IsString()
  internalCode: string;

  @ApiProperty({ example: 'Test product' })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @ApiProperty({ example: 100 })
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'kg' })
  @IsNotEmpty({ message: 'Unit is required' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 50.5, required: false })
  @IsOptional()
  @IsNumber()
  totalWeight?: number;

  @ApiProperty({ example: 2.5, required: false })
  @IsOptional()
  @IsNumber()
  totalVolume?: number;

  @ApiProperty({ example: 'Warehouse A', required: false })
  @IsOptional()
  @IsString()
  currentLocation?: string;

  @ApiProperty({ description: 'Supplier ID', required: true })
  @IsNotEmpty({ message: 'Supplier is required' })
  @IsUUID('4', { message: 'Invalid supplier ID' })
  supplierId: string;

  @ApiProperty({
    enum: ProductStatus,
    example: ProductStatus.RECEIVED,
    required: false,
    description: 'Product status (default: RECEIVED)',
  })
  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Invalid status' })
  status?: ProductStatus;
}
