// src/modules/suppliers/dto/create-supplier.dto.ts

import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  // 🏢 BASIC INFORMATION

  @ApiProperty({
    example: 'Supplier ABC Ltd',
    description: 'Supplier name',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @MinLength(3, { message: 'Name must have at least 3 characters' })
  @MaxLength(100, { message: 'Name must have at most 100 characters' })
  name: string;

  @ApiProperty({
    example: '123456789',
    description: 'Supplier NIF/NIPC (Portugal) - 8 or 9 digits',
  })
  @IsNotEmpty({ message: 'NIF is required' })
  @IsString()
  @MinLength(8, { message: 'NIF must have at least 8 digits' })
  @MaxLength(9, { message: 'NIF must have at most 9 digits' })
  nif: string;

  // 📧 CONTACTS

  @ApiProperty({
    example: 'supplier@example.com',
    description: 'Contact email',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty({
    example: '+351 912 345 678',
    description: 'Contact phone',
  })
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString()
  @MinLength(9, { message: 'Invalid phone number' })
  phone: string;

  // 📍 ADDRESS (Optional)

  @ApiProperty({
    example: 'Example Street, 123',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'Porto',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    example: 'Portugal',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  // 🏢 COMPANY ID (Injetado pelo TenantGuard)

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'ID da empresa (injetado automaticamente pelo TenantGuard)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'CompanyId inválido' })
  companyId?: string;
}
