import { Repository } from 'typeorm';
import { Customer, CustomerStatus } from '../../database/entities/customer.entity.js';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto.js';
export declare class CustomerService {
    private readonly customerRepo;
    private readonly logger;
    constructor(customerRepo: Repository<Customer>);
    listCustomers(params: {
        search?: string;
        status?: CustomerStatus;
        page?: number;
        limit?: number;
    }): Promise<{
        items: Customer[];
        pagination: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    createCustomer(dto: CreateCustomerDto, createdBy: number): Promise<Customer>;
    updateCustomer(id: number, dto: UpdateCustomerDto): Promise<Customer>;
    toggleStatus(id: number, status: CustomerStatus): Promise<{
        message: string;
    }>;
}
