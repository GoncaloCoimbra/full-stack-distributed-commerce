import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CompanyRepository } from '../../database/repositories/company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private companyRepository: CompanyRepository) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const existingNif = await this.companyRepository.findByNif(
      createCompanyDto.nif,
    );
    if (existingNif) {
      throw new ConflictException('NIF is already in use');
    }

    const existingEmail = await this.companyRepository.findByEmail(
      createCompanyDto.email,
    );
    if (existingEmail) {
      throw new ConflictException('Email is already in use');
    }

    return this.companyRepository.create(createCompanyDto);
  }

  async findAll() {
    return this.companyRepository.findAll();
  }

  async findOne(id: string) {
    const company = await this.companyRepository.findOne({ id }); // ✅
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async findWithUsers(id: string) {
    const company = await this.companyRepository.findWithUsers(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async findWithStats(id: string) {
    const company = await this.companyRepository.findWithStats(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id);
    return this.companyRepository.update({ id }, updateCompanyDto); // ✅
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.companyRepository.delete({ id }); // ✅
    return { message: 'Company deleted successfully' };
  }
}
