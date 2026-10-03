/**
 * Các vai trò chính trong hệ thống CELRA
 */
export enum RoleCode {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',       // Quản trị viên hệ thống (nền tảng)
  COMPANY_ADMIN = 'COMPANY_ADMIN',     // Quản trị viên doanh nghiệp (chủ tài khoản đăng ký)
  COMPANY_STAFF = 'COMPANY_STAFF',     // Nhân viên trực thuộc doanh nghiệp
}

/**
 * Danh sách mã quyền hạn (Permissions) chuẩn RBAC
 */
export enum PermissionCode {
  // Quyền liên quan nhân viên
  EMPLOYEE_VIEW = 'employee:view',
  EMPLOYEE_CREATE = 'employee:create',
  EMPLOYEE_UPDATE = 'employee:update',
  EMPLOYEE_DELETE = 'employee:delete',

  // Quyền liên quan khách hàng
  CUSTOMER_VIEW = 'customer:view',
  CUSTOMER_CREATE = 'customer:create',
  CUSTOMER_UPDATE = 'customer:update',

  // Quyền liên quan thông tin doanh nghiệp
  COMPANY_VIEW = 'company:view',
  COMPANY_UPDATE = 'company:update',
}

/**
 * Trạng thái tài khoản người dùng
 */
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
}

/**
 * Trạng thái doanh nghiệp
 */
export enum CompanyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

/**
 * Khóa metadata dùng cho Decorators
 */
export const PERMISSIONS_KEY = 'permissions';
