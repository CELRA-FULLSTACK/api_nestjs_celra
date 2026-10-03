import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionCode, PERMISSIONS_KEY, RoleCode } from '../../configs/constants.js';
import { CurrentUserPayload } from '../decorators/current-user.decorator.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionCode[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    // Nếu endpoint không yêu cầu quyền cụ thể nào -> cho phép
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as CurrentUserPayload | undefined;

    if (!user) {
      throw new ForbiddenException(
        'Không tìm thấy thông tin xác thực của người dùng',
      );
    }

    // System Admin có toàn quyền
    if (user.roleCode === RoleCode.SYSTEM_ADMIN) {
      return true;
    }

    const userPermissions = new Set(user.permissions || []);
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.has(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        'Bạn không có quyền hạn cần thiết để thực hiện thao tác này',
      );
    }

    return true;
  }
}
