import { CustomerStatus } from '../../database/entities/customer.entity.js';
import { CustomerService } from './customer.service.js';
import { CreateCustomerDto, ToggleCustomerStatusDto, UpdateCustomerDto } from './dto/customer.dto.js';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    listCustomers(search?: string, status?: CustomerStatus, page?: number, limit?: number): Promise<{
        items: import("../../database/entities/customer.entity.js").Customer[];
        pagination: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    createCustomer(dto: CreateCustomerDto, userId: number): Promise<import("../../database/entities/customer.entity.js").Customer>;
    updateCustomer(id: number, dto: UpdateCustomerDto): Promise<import("../../database/entities/customer.entity.js").Customer>;
    toggleStatus(id: number, dto: ToggleCustomerStatusDto): Promise<{
        message: string;
    }>;
}
