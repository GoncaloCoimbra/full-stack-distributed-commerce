import { PrismaService } from '../prisma.service';

export abstract class BaseRepository<T> {
  constructor(
    protected prisma: PrismaService,
    protected modelName: string,
  ) {}

  async findAll(where?: any): Promise<T[]> {
    return this.prisma[this.modelName].findMany({ where });
  }

  async findOne(where: any): Promise<T | null> {
    return this.prisma[this.modelName].findUnique({ where });
  }

  async create(data: any): Promise<T> {
    return this.prisma[this.modelName].create({ data });
  }

  async update(where: any, data: any): Promise<T> {
    return this.prisma[this.modelName].update({ where, data });
  }

  async delete(where: any): Promise<T> {
    return this.prisma[this.modelName].delete({ where });
  }

  async count(where?: any): Promise<number> {
    return this.prisma[this.modelName].count({ where });
  }
}
