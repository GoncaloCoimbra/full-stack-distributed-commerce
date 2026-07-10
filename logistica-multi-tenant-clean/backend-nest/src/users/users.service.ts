import { Injectable } from '@nestjs/common';
import { UserRepository } from '../database/repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByCompany(companyId: string) {
    return this.userRepository.findByCompany(companyId);
  }

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findSuperAdmins() {
    return this.userRepository.findSuperAdmins();
  }
}
