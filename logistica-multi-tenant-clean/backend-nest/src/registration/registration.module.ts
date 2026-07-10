import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RegistrationController } from './controllers/registration.controller';
import { RegistrationService } from './registration.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'replace-with-a-secure-random-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
