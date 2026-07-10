import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ required: false })
  companyId?: string;

  @ApiProperty({ required: false })
  companyName?: string;

  @ApiProperty({ required: false })
  avatarUrl?: string;

  @ApiProperty({ required: false })
  isActive?: boolean;
}

export class AuthResponseDto {
  @ApiProperty()
  token: string; //  Mudado de 'accessToken' para 'token'

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
