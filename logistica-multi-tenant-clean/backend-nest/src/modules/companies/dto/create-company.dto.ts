import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Empresa XYZ' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '123456789' })
  @IsNotEmpty()
  @IsString()
  nif: string;

  @ApiProperty({ example: 'Rua ABC, 123' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'empresa@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '912345678' })
  @IsOptional()
  @IsString()
  phone?: string;
}
