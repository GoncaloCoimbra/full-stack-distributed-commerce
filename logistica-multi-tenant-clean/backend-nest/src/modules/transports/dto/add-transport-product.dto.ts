import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';

export class AddTransportProductDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Product ID',
  })
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsUUID('4', { message: 'Invalid product ID' })
  productId: string;

  @ApiProperty({
    example: 1,
    description: 'Quantity to add to the transport',
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity?: number;
}
