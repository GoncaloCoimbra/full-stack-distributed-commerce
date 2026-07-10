import { ApiProperty } from '@nestjs/swagger';
import { ReferralStatus } from '@prisma/client';

export class ReferralResponseDto {
  @ApiProperty({
    description: 'ID único da referência',
    example: 'uuid-da-referencia',
  })
  id: string;

  @ApiProperty({ description: 'Nome do cliente', example: 'Empresa Alpha' })
  clientName: string;

  @ApiProperty({
    description: 'Informações de contacto',
    example: 'alpha@example.com | +351 912 345 678',
  })
  contactInfo: string;

  @ApiProperty({ description: 'Fonte da referência', example: 'Website' })
  referralSource: string;

  @ApiProperty({
    description: 'Status da referência',
    enum: ReferralStatus,
    example: ReferralStatus.NEW,
  })
  status: ReferralStatus;

  @ApiProperty({
    description: 'Tipo de projeto',
    example: 'FREIGHT',
  })
  projectType: string; // ← MUDAR PARA STRING

  @ApiProperty({ description: 'Valor estimado', example: 1200 })
  estimatedValue: number;

  @ApiProperty({
    description: 'Data da referência',
    example: '2026-01-07T00:00:00.000Z',
  })
  referralDate: Date;

  @ApiProperty({
    description: 'Notas adicionais',
    example: 'Cliente potencial',
    nullable: true,
  })
  notes: string | null;

  @ApiProperty({
    description: 'Nome de quem referenciou',
    example: 'João Silva',
  })
  referredBy: string;

  @ApiProperty({ description: 'Comissão', example: 60, nullable: true })
  commission: number | null;

  @ApiProperty({
    description: 'Data de criação',
    example: '2026-01-06T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2026-01-06T10:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({ description: 'ID da empresa', example: 'uuid-da-empresa' })
  companyId: string;
}

export class ReferralStatsDto {
  @ApiProperty({ description: 'Total de referências', example: 42 })
  total: number;

  @ApiProperty({ description: 'Referências novas', example: 15 })
  new: number;

  @ApiProperty({ description: 'Referências contactadas', example: 10 })
  contacted: number;

  @ApiProperty({ description: 'Referências convertidas', example: 12 })
  converted: number;

  @ApiProperty({ description: 'Referências perdidas', example: 5 })
  lost: number;

  @ApiProperty({ description: 'Valor total estimado', example: 50000 })
  totalEstimatedValue: number;

  @ApiProperty({ description: 'Total de comissões', example: 2500 })
  totalCommission: number;

  @ApiProperty({ description: 'Taxa de conversão (%)', example: 28.5 })
  conversionRate: number;
}
