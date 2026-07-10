import { IsOptional, IsEmail } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  taxId?: string;
}
