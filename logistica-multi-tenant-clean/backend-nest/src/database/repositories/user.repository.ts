import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        company: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });
  }

  async findByCompany(companyId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { companyId },
      include: {
        company: true,
      },
    });
  }

  async findSuperAdmins(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { role: 'SUPER_ADMIN' },
    });
  }
}
