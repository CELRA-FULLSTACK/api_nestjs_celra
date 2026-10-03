var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CustomerService_1;
import { ConflictException, Injectable, Logger, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, CustomerStatus } from '../../database/entities/customer.entity.js';
let CustomerService = CustomerService_1 = class CustomerService {
    customerRepo;
    logger = new Logger(CustomerService_1.name);
    constructor(customerRepo) {
        this.customerRepo = customerRepo;
    }
    async listCustomers(params) {
        const { search = '', status, page = 1, limit = 10 } = params;
        const query = this.customerRepo.createQueryBuilder('customer');
        if (status) {
            query.andWhere('customer.status = :status', { status });
        }
        if (search) {
            query.andWhere('(customer.name LIKE :search OR customer.phone LIKE :search OR customer.email LIKE :search)', { search: `%${search}%` });
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
    async createCustomer(dto, createdBy) {
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
    async updateCustomer(id, dto) {
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
    async toggleStatus(id, status) {
        const customer = await this.customerRepo.findOne({ where: { id } });
        if (!customer) {
            throw new NotFoundException('Không tìm thấy khách hàng.');
        }
        customer.status = status;
        await this.customerRepo.save(customer);
        return {
            message: status === CustomerStatus.ACTIVE
                ? 'Đã kích hoạt lại khách hàng.'
                : 'Đã vô hiệu hóa khách hàng.',
        };
    }
};
CustomerService = CustomerService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Customer)),
    __metadata("design:paramtypes", [Repository])
], CustomerService);
export { CustomerService };
//# sourceMappingURL=customer.service.js.map