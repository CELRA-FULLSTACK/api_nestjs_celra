export declare const envConfig: (() => {
    port: number;
    nodeEnv: string;
    frontendUrl: string;
    database: {
        type: "postgres";
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        synchronize: boolean;
        logging: boolean;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    resetToken: {
        expiresMinutes: number;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    nodeEnv: string;
    frontendUrl: string;
    database: {
        type: "postgres";
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        synchronize: boolean;
        logging: boolean;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    resetToken: {
        expiresMinutes: number;
    };
}>;
