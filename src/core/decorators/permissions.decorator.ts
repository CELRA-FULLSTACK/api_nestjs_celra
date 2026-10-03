import { SetMetadata } from '@nestjs/common';
import { PermissionCode, PERMISSIONS_KEY } from '../../configs/constants.js';

/**
 * Decorator khai báo các quyền bắt buộc để truy cập endpoint
 */
export const RequirePermissions = (...permissions: PermissionCode[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
