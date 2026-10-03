import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AllExceptionFilter } from './core/filters/all-exception.filter.js';
import { TransformResponseInterceptor } from './core/interceptors/transform-response.interceptor.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Cho phép gọi API từ frontend qua CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // 2. Tự động kiểm tra dữ liệu đầu vào thông qua DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 3. Chuẩn hóa format phản hồi và xử lý ngoại lệ toàn cục
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 CELRA Backend API is running on: http://localhost:${port}`);
}
await bootstrap();
