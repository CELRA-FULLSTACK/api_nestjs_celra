export declare enum RoleCode {
    SYSTEM_ADMIN = "SYSTEM_ADMIN",
    COMPANY_ADMIN = "COMPANY_ADMIN",
    COMPANY_STAFF = "COMPANY_STAFF"
}
export declare enum PermissionCode {
    EMPLOYEE_VIEW = "employee:view",
    EMPLOYEE_CREATE = "employee:create",
    EMPLOYEE_UPDATE = "employee:update",
    EMPLOYEE_DELETE = "employee:delete",
    CUSTOMER_VIEW = "customer:view",
    CUSTOMER_CREATE = "customer:create",
    CUSTOMER_UPDATE = "customer:update",
    COMPANY_VIEW = "company:view",
    COMPANY_UPDATE = "company:update"
}
export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    LOCKED = "LOCKED"
}
export declare enum CompanyStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED"
}
export declare const PERMISSIONS_KEY = "permissions";
