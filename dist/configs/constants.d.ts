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
    COMPANY_UPDATE = "company:update",
    COMPLIANCE_VIEW = "compliance:view",
    COMPLIANCE_ASSESS = "compliance:assess",
    COMPLIANCE_TASK_UPDATE = "compliance:task_update",
    PROFILE_VIEW = "profile:view",
    PROFILE_UPDATE = "profile:update",
    TASK_VIEW = "task:view",
    TASK_UPDATE = "task:update",
    EVIDENCE_UPLOAD = "evidence:upload",
    EVIDENCE_VIEW = "evidence:view",
    LEGAL_VIEW = "legal:view",
    LEGAL_MANAGE = "legal:manage"
}
export declare enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVE = "RESOLVE",
    DONE = "DONE"
}
export declare enum SeverityLevel {
    CRITICAL = "CRITICAL",
    MAJOR = "MAJOR",
    STANDARD = "STANDARD"
}
export declare enum AssessmentStatus {
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
export declare enum ComplianceItemStatus {
    COMPLIANT = "COMPLIANT",
    NON_COMPLIANT = "NON_COMPLIANT",
    MISSING_EVIDENCE = "MISSING_EVIDENCE",
    NEED_EXPERT = "NEED_EXPERT"
}
export declare enum EvidenceVerificationStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
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
