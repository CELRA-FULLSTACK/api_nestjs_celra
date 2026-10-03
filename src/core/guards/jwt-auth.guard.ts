import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CurrentUserPayload } from '../decorators/current-user.decorator.js';

export interface AuthenticatedRequest extends Request {
  user?: CurrentUserPayload;
}
interface JwtTokenPayload {
  sub: number;
  username: string;
  email: string;
  companyId: number | null;
  roleCode: string;
  permissions: string[];
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Vui lòng đăng nhập với mã token hợp lệ để tiếp tục',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync<JwtTokenPayload>(token);

      const currentUser: CurrentUserPayload = {
        userId: payload.sub,
        username: payload.username,
        email: payload.email,
        companyId: payload.companyId,
        roleCode: payload.roleCode,
        permissions: payload.permissions || [],
      };

      // Gắn payload người dùng vào request context
      request.user = currentUser;
      return true;
    } catch {
      throw new UnauthorizedException(
        'Phiên làm việc của bạn đã hết hạn hoặc token không hợp lệ',
      );
    }
  }
}
