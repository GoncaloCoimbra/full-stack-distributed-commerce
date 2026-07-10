import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'New product movement',
    description: 'Notification title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Product XYZ was moved to warehouse A',
    description: 'Notification content',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class MarkAsReadDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Notification ID',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
