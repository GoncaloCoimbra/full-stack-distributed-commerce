import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ReferralStatus } from '@prisma/client'; // ← MUDAR PARA PRISMA

export class UpdateReferralDto {
  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;

  @IsOptional()
  @IsString()
  referralSource?: string;

  @IsOptional()
  @IsEnum(ReferralStatus)
  status?: ReferralStatus;

  @IsOptional()
  @IsString()
  projectType?: string;

  @IsOptional()
  @IsNumber()
  estimatedValue?: number;

  @IsOptional()
  @IsDateString()
  referralDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  referredBy?: string;

  @IsOptional()
  @IsNumber()
  commission?: number;
}

export class UpdateReferralStatusDto {
  @IsEnum(ReferralStatus)
  status: ReferralStatus;
}
