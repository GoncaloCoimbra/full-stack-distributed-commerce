import { Controller, Post, Body } from '@nestjs/common';
import { RegistrationService } from '../registration.service';
import { Public } from '@common/decorators/public.decorator';

interface RegisterCompanyDto {
  companyName: string;
  companyNif: string;
  companyEmail: string;
  companyPhone?: string;
  companyAddress?: string;
  userName: string;
  userEmail: string;
  userPassword: string;
}

@Controller('auth/registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Public()
  @Post('company')
  async registerCompany(@Body() registerCompanyDto: RegisterCompanyDto) {
    return this.registrationService.registerCompanyAndUser(registerCompanyDto);
  }
}
