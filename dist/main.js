import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AllExceptionFilter } from './core/filters/all-exception.filter.js';
import { TransformResponseInterceptor } from './core/interceptors/transform-response.interceptor.js';
async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new TransformResponseInterceptor());
    app.useGlobalFilters(new AllExceptionFilter());
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`🚀 CELRA Backend API is running on: http://localhost:${port}`);
}
await bootstrap();
//# sourceMappingURL=main.js.map