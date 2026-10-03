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
})(PermissionCode || (PermissionCode = {}));
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