import {
  Controller,
  Post,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RegistrationService } from '../../../registration/registration.service';

interface RegisterDto {
  companyName: string;
  companyNif: string;
  companyEmail: string;
  companyPhone?: string;
  companyAddress?: string;
  userName: string;
  userEmail: string;
  userPassword: string;
}

@Controller('registration')
export class RegistrationController {
  private readonly logger = new Logger(RegistrationController.name);

  constructor(private readonly registrationService: RegistrationService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    this.logger.log('📨 Requisição de registro recebida');
    this.logger.log(`🏢 Company: ${dto.companyName}`);
    this.logger.log(`📧 Email Company: ${dto.companyEmail}`);
    this.logger.log(`🆔 NIF: ${dto.companyNif}`);
    this.logger.log(`👤 Usuário: ${dto.userName}`);
    this.logger.log(`📧 Email Usuário: ${dto.userEmail}`);

    try {
      const result = await this.registrationService.registerCompanyAndUser(dto);

      this.logger.log(' Registro completado com success!');
      this.logger.log(`👤 User ID: ${result.user.id}`);
      this.logger.log(`🏢 Company ID: ${result.user.companyId}`);
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      return result;
    } catch (error) {
      this.logger.error(' Error no registro:', error.message);
      this.logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      throw error;
    }
  }
}
