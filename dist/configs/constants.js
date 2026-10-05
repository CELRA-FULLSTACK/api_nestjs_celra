export var RoleCode;
(function (RoleCode) {
    RoleCode["SYSTEM_ADMIN"] = "SYSTEM_ADMIN";
    RoleCode["COMPANY_ADMIN"] = "COMPANY_ADMIN";
    RoleCode["COMPANY_STAFF"] = "COMPANY_STAFF";
})(RoleCode || (RoleCode = {}));
export var PermissionCode;
(function (PermissionCode) {
    PermissionCode["EMPLOYEE_VIEW"] = "employee:view";
    PermissionCode["EMPLOYEE_CREATE"] = "employee:create";
    PermissionCode["EMPLOYEE_UPDATE"] = "employee:update";
    PermissionCode["EMPLOYEE_DELETE"] = "employee:delete";
    PermissionCode["CUSTOMER_VIEW"] = "customer:view";
    PermissionCode["CUSTOMER_CREATE"] = "customer:create";
    PermissionCode["CUSTOMER_UPDATE"] = "customer:update";
    PermissionCode["COMPANY_VIEW"] = "company:view";
    PermissionCode["COMPANY_UPDATE"] = "company:update";
    PermissionCode["COMPLIANCE_VIEW"] = "compliance:view";
    PermissionCode["COMPLIANCE_ASSESS"] = "compliance:assess";
    PermissionCode["COMPLIANCE_TASK_UPDATE"] = "compliance:task_update";
    PermissionCode["PROFILE_VIEW"] = "profile:view";
    PermissionCode["PROFILE_UPDATE"] = "profile:update";
    PermissionCode["TASK_VIEW"] = "task:view";
    PermissionCode["TASK_UPDATE"] = "task:update";
    PermissionCode["EVIDENCE_UPLOAD"] = "evidence:upload";
    PermissionCode["EVIDENCE_VIEW"] = "evidence:view";
    PermissionCode["LEGAL_VIEW"] = "legal:view";
    PermissionCode["LEGAL_MANAGE"] = "legal:manage";
})(PermissionCode || (PermissionCode = {}));
export var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "TODO";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["RESOLVE"] = "RESOLVE";
    TaskStatus["DONE"] = "DONE";
})(TaskStatus || (TaskStatus = {}));
export var SeverityLevel;
(function (SeverityLevel) {
    SeverityLevel["CRITICAL"] = "CRITICAL";
    SeverityLevel["MAJOR"] = "MAJOR";
    SeverityLevel["STANDARD"] = "STANDARD";
})(SeverityLevel || (SeverityLevel = {}));
export var AssessmentStatus;
(function (AssessmentStatus) {
    AssessmentStatus["IN_PROGRESS"] = "IN_PROGRESS";
    AssessmentStatus["COMPLETED"] = "COMPLETED";
    AssessmentStatus["FAILED"] = "FAILED";
})(AssessmentStatus || (AssessmentStatus = {}));
export var ComplianceItemStatus;
(function (ComplianceItemStatus) {
    ComplianceItemStatus["COMPLIANT"] = "COMPLIANT";
    ComplianceItemStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
    ComplianceItemStatus["MISSING_EVIDENCE"] = "MISSING_EVIDENCE";
    ComplianceItemStatus["NEED_EXPERT"] = "NEED_EXPERT";
})(ComplianceItemStatus || (ComplianceItemStatus = {}));
export var EvidenceVerificationStatus;
(function (EvidenceVerificationStatus) {
    EvidenceVerificationStatus["PENDING"] = "PENDING";
    EvidenceVerificationStatus["APPROVED"] = "APPROVED";
    EvidenceVerificationStatus["REJECTED"] = "REJECTED";
})(EvidenceVerificationStatus || (EvidenceVerificationStatus = {}));
export var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["LOCKED"] = "LOCKED";
})(UserStatus || (UserStatus = {}));
export var CompanyStatus;
(function (CompanyStatus) {
    CompanyStatus["ACTIVE"] = "ACTIVE";
    CompanyStatus["INACTIVE"] = "INACTIVE";
    CompanyStatus["SUSPENDED"] = "SUSPENDED";
})(CompanyStatus || (CompanyStatus = {}));
export const PERMISSIONS_KEY = 'permissions';
//# sourceMappingURL=constants.js.map