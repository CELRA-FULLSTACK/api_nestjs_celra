import { CustomerStatus } from '../../../database/entities/customer.entity.js';
export declare class CreateCustomerDto {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
}
export declare class UpdateCustomerDto {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
}
export declare class ToggleCustomerStatusDto {
    status: CustomerStatus;
}
