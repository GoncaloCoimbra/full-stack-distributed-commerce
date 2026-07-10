import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from '../modules/users/controllers/users.controller';
import { UserRepository } from '../database/repositories/user.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
