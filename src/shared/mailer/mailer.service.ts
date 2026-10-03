import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Gửi email chứa đường dẫn đặt lại mật khẩu
   * Trong môi trường phát triển, log trực tiếp đường dẫn ra console để kiểm thử
   */
  async sendResetPasswordEmail(
    toEmail: string,
    token: string,
  ): Promise<{ resetUrl: string }> {
    const frontendUrl =
      this.configService.get<string>('app.frontendUrl') ||
      'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    this.logger.log('========================================================');
    this.logger.log(`📧 GỬI EMAIL ĐẶT LẠI MẬT KHẨU TỚI: ${toEmail}`);
    this.logger.log(`🔗 Link xác thực (hết hạn sau 15 phút): ${resetUrl}`);
    this.logger.log('========================================================');

    return { resetUrl };
  }
}
