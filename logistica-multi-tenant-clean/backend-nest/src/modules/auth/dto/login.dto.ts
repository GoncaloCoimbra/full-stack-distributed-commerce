import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'admin@logistica.com',
    description: 'User email registered in the system',
    type: String,
  })
  @IsEmail({}, { message: 'Invalid email. Please enter a valid email.' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'admin123',
    description: 'User password (minimum 6 characters)',
    minLength: 6,
    maxLength: 128,
    type: String,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  password: string;
}
