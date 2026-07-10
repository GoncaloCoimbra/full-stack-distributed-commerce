import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ReferralStatus } from '@prisma/client';

export class CreateReferralDto {
  @ApiProperty({
    description: 'Nome do cliente',
    example: 'Empresa Alpha',
  })
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @ApiProperty({
    description: 'Informações de contacto',
    example: 'alpha@example.com | +351 912 345 678',
  })
  @IsString()
  @IsNotEmpty()
  contactInfo: string;

  @ApiProperty({
    description: 'Fonte da referência',
    example: 'Website',
    required: false,
  })
  @IsString()
  @IsOptional()
  referralSource?: string;

  @ApiProperty({
    description: 'Status da referência',
    enum: ReferralStatus,
    example: ReferralStatus.NEW,
    required: false,
  })
  @IsEnum(ReferralStatus)
  @IsOptional()
  status?: ReferralStatus;

  @ApiProperty({
    description: 'Tipo de projeto',
    example: 'FREIGHT',
  })
  @IsString()
  @IsNotEmpty()
  projectType: string; // ← MUDAR PARA STRING

  @ApiProperty({
    description: 'Valor estimado do projeto',
    example: 1200,
  })
  @IsNumber()
  @IsNotEmpty()
  estimatedValue: number;

  @ApiProperty({
    description: 'Data da referência',
    example: '2026-01-07',
  })
  @IsDateString()
  @IsNotEmpty()
  referralDate: string;

  @ApiProperty({
    description: 'Notas adicionais',
    example: 'Cliente potencial vindo do site',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Nome de quem fez a referência',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  referredBy: string;

  @ApiProperty({
    description: 'Valor da comissão',
    example: 60,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  commission?: number;

  @ApiProperty({
    description: 'ID da empresa (apenas para SUPER_ADMIN)',
    example: 'uuid-da-empresa',
    required: false,
  })
  @IsString()
  @IsOptional()
  companyId?: string;
}
