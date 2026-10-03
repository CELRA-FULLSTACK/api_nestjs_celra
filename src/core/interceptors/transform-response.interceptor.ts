import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  code: number;
  status: boolean;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((res) => {
        // Nếu response đã được format sẵn theo chuẩn thì giữ nguyên
        if (res && typeof res === 'object' && 'code' in res && 'status' in res) {
          return res;
        }

        const httpResponse = context.switchToHttp().getResponse();
        const statusCode = httpResponse?.statusCode || 200;

        return {
          code: statusCode,
          status: true,
          message: 'Thành công',
          data: res ?? null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
