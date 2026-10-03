var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailerService_1;
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
let MailerService = MailerService_1 = class MailerService {
    configService;
    logger = new Logger(MailerService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async sendResetPasswordEmail(toEmail, token) {
        const frontendUrl = this.configService.get('app.frontendUrl') ||
            'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
        this.logger.log('========================================================');
        this.logger.log(`📧 GỬI EMAIL ĐẶT LẠI MẬT KHẨU TỚI: ${toEmail}`);
        this.logger.log(`🔗 Link xác thực (hết hạn sau 15 phút): ${resetUrl}`);
        this.logger.log('========================================================');
        return { resetUrl };
    }
};
MailerService = MailerService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], MailerService);
export { MailerService };
//# sourceMappingURL=mailer.service.js.map