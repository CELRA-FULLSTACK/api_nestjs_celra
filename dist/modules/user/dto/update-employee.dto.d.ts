import { UserStatus } from '../../../configs/constants.js';
export declare class UpdateEmployeeDto {
    full_name?: string;
    phone?: string;
    status?: UserStatus;
    role_id?: number;
    new_password?: string;
}
