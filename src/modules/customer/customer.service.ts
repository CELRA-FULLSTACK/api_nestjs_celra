import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, CustomerStatus } from '../../database/entities/customer.entity.js';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto.js';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async listCustomers(params: {
    search?: string;
    status?: CustomerStatus;
    page?: number;
    limit?: number;
  }) {
    const { search = '', status, page = 1, limit = 10 } = params;
    const query = this.customerRepo.createQueryBuilder('customer');

    if (status) {
      query.andWhere('customer.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(customer.name LIKE :search OR customer.phone LIKE :search OR customer.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const total = await query.getCount();
    const items = await query
      .orderBy('customer.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      items,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async createCustomer(dto: CreateCustomerDto, createdBy: number) {
    const existing = await this.customerRepo.findOne({
      where: { phone: dto.phone },
    });
    if (existing) {
      throw new ConflictException('Số điện thoại này đã tồn tại trong hệ thống.');
    }

    const customer = this.customerRepo.create({
      ...dto,
      email: dto.email || null,
      address: dto.address || null,
      notes: dto.notes || null,
      status: CustomerStatus.ACTIVE,
      created_by: createdBy,
    });

    const saved = await this.customerRepo.save(customer);
    this.logger.log(`Tạo khách hàng mới: ${saved.name} (${saved.phone})`);
    return saved;
  }

  async updateCustomer(id: number, dto: UpdateCustomerDto) {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Không tìm thấy khách hàng.');
    }

    if (dto.phone && dto.phone !== customer.phone) {
      const existing = await this.customerRepo.findOne({
        where: { phone: dto.phone },
      });
      if (existing) {
        throw new ConflictException('Số điện thoại này đã tồn tại.');
      }
    }

    Object.assign(customer, {
      ...dto,
      email: dto.email !== undefined ? dto.email || null : customer.email,
      address: dto.address !== undefined ? dto.address || null : customer.address,
      notes: dto.notes !== undefined ? dto.notes || null : customer.notes,
    });

    return this.customerRepo.save(customer);
  }

  async toggleStatus(id: number, status: CustomerStatus) {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Không tìm thấy khách hàng.');
    }

    customer.status = status;
    await this.customerRepo.save(customer);

    return {
      message:
        status === CustomerStatus.ACTIVE
          ? 'Đã kích hoạt lại khách hàng.'
          : 'Đã vô hiệu hóa khách hàng.',
    };
  }
}
