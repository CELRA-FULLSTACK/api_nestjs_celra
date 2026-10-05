var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '../../shared/mailer/mailer.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Global(),
    Module({
        imports: [
            MailerModule,
            JwtModule.registerAsync({
                imports: [ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get('app.jwt.secret'),
                    signOptions: {
                        expiresIn: (configService.get('app.jwt.expiresIn') ||
                            '7d'),
                    },
                }),
                inject: [ConfigService],
            }),
        ],
        controllers: [AuthController],
        providers: [AuthService],
        exports: [AuthService, JwtModule],
    })
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map