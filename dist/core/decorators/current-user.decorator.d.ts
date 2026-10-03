export interface CurrentUserPayload {
    userId: number;
    username: string;
    email: string;
    companyId: number | null;
    roleCode: string;
    permissions: string[];
}
export declare const CurrentUser: (...dataOrPipes: (keyof CurrentUserPayload | import("@nestjs/common").ParameterDecoratorOptions | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
