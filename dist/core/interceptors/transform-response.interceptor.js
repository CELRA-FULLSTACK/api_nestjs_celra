var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, } from '@nestjs/common';
import { map } from 'rxjs/operators';
let TransformResponseInterceptor = class TransformResponseInterceptor {
    intercept(context, next) {
        return next.handle().pipe(map((res) => {
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
        }));
    }
};
TransformResponseInterceptor = __decorate([
    Injectable()
], TransformResponseInterceptor);
export { TransformResponseInterceptor };
//# sourceMappingURL=transform-response.interceptor.js.map