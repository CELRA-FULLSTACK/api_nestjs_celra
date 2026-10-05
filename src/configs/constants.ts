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

  // Quyền liên quan hồ sơ & tuân thủ pháp lý
  COMPLIANCE_VIEW = 'compliance:view',
  COMPLIANCE_ASSESS = 'compliance:assess',
  COMPLIANCE_TASK_UPDATE = 'compliance:task_update',
  PROFILE_VIEW = 'profile:view',
  PROFILE_UPDATE = 'profile:update',
  TASK_VIEW = 'task:view',
  TASK_UPDATE = 'task:update',
  EVIDENCE_UPLOAD = 'evidence:upload',
  EVIDENCE_VIEW = 'evidence:view',

  // Quyền liên quan kho tri thức pháp lý
  LEGAL_VIEW = 'legal:view',
  LEGAL_MANAGE = 'legal:manage',
}

/**
 * Trạng thái công việc tuân thủ (Kanban 4 cột)
 */
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVE = 'RESOLVE',
  DONE = 'DONE',
}

/**
 * Mức độ nghiêm trọng của rủi ro tuân thủ
 */
export enum SeverityLevel {
  CRITICAL = 'CRITICAL',
  MAJOR = 'MAJOR',
  STANDARD = 'STANDARD',
}

/**
 * Trạng thái phiên đánh giá tuân thủ
 */
export enum AssessmentStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/**
 * Kết quả phân tích từng điều kiện nghĩa vụ
 */
export enum ComplianceItemStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  MISSING_EVIDENCE = 'MISSING_EVIDENCE',
  NEED_EXPERT = 'NEED_EXPERT',
}

/**
 * Trạng thái xác thực của hồ sơ minh chứng
 */
export enum EvidenceVerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
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
