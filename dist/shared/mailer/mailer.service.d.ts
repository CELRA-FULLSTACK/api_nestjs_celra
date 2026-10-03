import { ConfigService } from '@nestjs/config';
export declare class MailerService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    sendResetPasswordEmail(toEmail: string, token: string): Promise<{
        resetUrl: string;
    }>;
}
