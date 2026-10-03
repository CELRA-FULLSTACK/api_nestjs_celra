export declare enum CustomerStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare class Customer {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    notes: string | null;
    status: string;
    created_by: number | null;
    created_at: Date;
    updated_at: Date;
}
