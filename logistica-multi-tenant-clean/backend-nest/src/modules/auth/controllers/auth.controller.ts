import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UpdateProfileDto, ChangePasswordDto } from '../dto/update-profile.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

//  Tipo customizado para Multer
type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //  REGISTER
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registar  new utilizador' })
  @ApiResponse({
    status: 201,
    description: 'Utilizador registado com success',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  //  LOGIN
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de utilizador' })
  @ApiResponse({
    status: 200,
    description: 'Login efetuado com success',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  //  REFRESH TOKEN
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar access token' })
  @ApiResponse({
    status: 200,
    description: 'Token renovado com success',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Refresh token inválido' })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  //  REVOKE REFRESH TOKEN
  @Public()
  @Post('revoke')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revogar refresh token' })
  async revoke(@Body('refreshToken') refreshToken: string) {
    return this.authService.revokeRefreshToken(refreshToken);
  }

  //  GET PROFILE
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get dados do utilizador autenticado' })
  @ApiResponse({ status: 200, description: 'Dados do utilizador' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getProfile(@CurrentUser() user: any) {
    return user;
  }

  //  UPDATE PROFILE
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update perfil do utilizador' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com success' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(user.id, updateProfileDto);
  }

  //  CHANGE PASSWORD
  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alterar password' })
  @ApiResponse({ status: 200, description: 'Password alterada com success' })
  @ApiResponse({ status: 400, description: 'Password atual incorreta' })
  async changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, changePasswordDto);
  }

  //  UPLOAD AVATAR
  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-date')
  @ApiOperation({ summary: 'Fazer upload do avatar' })
  @ApiResponse({ status: 200, description: 'Avatar atualizado com success' })
  @ApiResponse({ status: 400, description: 'Ficheiro inválido' })
  async uploadAvatar(
    @CurrentUser() user: any,
    @UploadedFile() file: MulterFile,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum ficheiro enviado');
    }

    // Validate tipo
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('O ficheiro deve ser uma imagem');
    }

    // Validate tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('A imagem deve ter no máximo 5MB');
    }

    return this.authService.uploadAvatar(user.id, file);
  }

  //  REMOVE AVATAR
  @Delete('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove avatar' })
  @ApiResponse({ status: 200, description: 'Avatar removido com success' })
  async removeAvatar(@CurrentUser() user: any) {
    return this.authService.removeAvatar(user.id);
  }
}
