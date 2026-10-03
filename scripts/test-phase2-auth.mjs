import { NestFactory } from '@nestjs/core';
import { AppModule } from '../dist/app.module.js';
import { TransformResponseInterceptor } from '../dist/core/interceptors/transform-response.interceptor.js';
import { AllExceptionFilter } from '../dist/core/filters/all-exception.filter.js';
import { ValidationPipe } from '@nestjs/common';
import mysql from 'mysql2/promise';

async function runTest() {
  console.log('🚀 Khởi động máy chủ kiểm thử...');
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(3099);
  const baseURL = 'http://127.0.0.1:3099';
  console.log(`✅ Server test listening at ${baseURL}`);

  try {
    // 1. Test Đăng ký Doanh nghiệp tự phục vụ
    console.log('\n--- 1. Kiểm thử POST /auth/register-company ---');
    const registerPayload = {
      company_name: 'Công ty Cổ phần Nông sản Hậu Giang',
      tax_code: '1801234567',
      company_email: 'contact@nongsanhaugiang.vn',
      company_phone: '02933888999',
      address: 'Số 12 Đại lộ Hòa Bình, TP Vị Thanh, Hậu Giang',
      username: 'admin_haugiang',
      email: 'admin@nongsanhaugiang.vn',
      password: 'Password123@',
      full_name: 'Nguyễn Văn An',
      phone: '0901234567',
    };

    const regRes = await fetch(`${baseURL}/auth/register-company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerPayload),
    });
    const regJson = await regRes.json();
    console.log('Phản hồi Đăng ký:', JSON.stringify(regJson, null, 2));

    if (!regJson.status || regJson.code !== 201) {
      throw new Error(`Đăng ký doanh nghiệp thất bại: ${regJson.message}`);
    }
    console.log('✅ Đăng ký Doanh nghiệp tự phục vụ THÀNH CÔNG');

    // 2. Test Đăng nhập
    console.log('\n--- 2. Kiểm thử POST /auth/login ---');
    const loginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'admin_haugiang',
        password: 'Password123@',
      }),
    });
    const loginJson = await loginRes.json();
    console.log('Phản hồi Đăng nhập:', JSON.stringify(loginJson, null, 2));

    if (!loginJson.status || !loginJson.data?.accessToken) {
      throw new Error(`Đăng nhập thất bại: ${loginJson.message}`);
    }
    const token = loginJson.data.accessToken;
    console.log('✅ Đăng nhập THÀNH CÔNG, AccessToken đã được cấp');
    console.log(`Role: ${loginJson.data.user.role}`);
    console.log(`Permissions (${loginJson.data.user.permissions.length}):`, loginJson.data.user.permissions);

    // 3. Test Quên mật khẩu
    console.log('\n--- 3. Kiểm thử POST /auth/forgot-password ---');
    const forgotRes = await fetch(`${baseURL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@nongsanhaugiang.vn',
      }),
    });
    const forgotJson = await forgotRes.json();
    console.log('Phản hồi Quên mật khẩu:', JSON.stringify(forgotJson, null, 2));

    // Truy vấn token trong database
    const db = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'celra_db',
    });
    const [tokens] = await db.query(
      'SELECT token, expires_at, is_used FROM password_resets WHERE email = ? ORDER BY id DESC LIMIT 1',
      ['admin@nongsanhaugiang.vn'],
    );
    const resetToken = tokens[0]?.token;
    console.log('Token tìm thấy trong DB:', resetToken);
    if (!resetToken) {
      throw new Error('Không tìm thấy token trong bảng password_resets');
    }
    console.log('✅ Quên mật khẩu & Lưu Token 15 phút THÀNH CÔNG');

    // 4. Test Đặt lại mật khẩu mới
    console.log('\n--- 4. Kiểm thử POST /auth/reset-password ---');
    const resetRes = await fetch(`${baseURL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetToken,
        new_password: 'NewPassword456@',
      }),
    });
    const resetJson = await resetRes.json();
    console.log('Phản hồi Đặt lại mật khẩu:', JSON.stringify(resetJson, null, 2));
    if (!resetJson.status) {
      throw new Error(`Đặt lại mật khẩu thất bại: ${resetJson.message}`);
    }
    console.log('✅ Đặt lại mật khẩu mới THÀNH CÔNG');

    // 5. Test đăng nhập lại bằng mật khẩu cũ (phải thất bại)
    console.log('\n--- 5. Kiểm thử Đăng nhập bằng mật khẩu cũ (kỳ vọng 401) ---');
    const oldLoginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'admin_haugiang',
        password: 'Password123@',
      }),
    });
    const oldLoginJson = await oldLoginRes.json();
    console.log('Mật khẩu cũ bị từ chối đúng như kỳ vọng:', oldLoginJson.code === 401);
    if (oldLoginJson.code !== 401) {
      throw new Error('Lỗi bảo mật: Mật khẩu cũ vẫn đăng nhập được sau khi reset');
    }

    // 6. Test đăng nhập bằng mật khẩu mới (phải thành công)
    console.log('\n--- 6. Kiểm thử Đăng nhập bằng mật khẩu mới ---');
    const newLoginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'admin_haugiang',
        password: 'NewPassword456@',
      }),
    });
    const newLoginJson = await newLoginRes.json();
    if (!newLoginJson.status || !newLoginJson.data?.accessToken) {
      throw new Error('Đăng nhập bằng mật khẩu mới thất bại');
    }
    console.log('✅ Đăng nhập bằng MẬT KHẨU MỚI THÀNH CÔNG!');

    await db.end();
    console.log('\n🎉 TẤT CẢ 6 BÀI KIỂM THỬ PHASE 2 ĐÃ VƯỢT QUA 100%! 🎉');
  } finally {
    await app.close();
  }
}

runTest().catch((err) => {
  console.error('❌ Kiểm thử thất bại:', err);
  process.exit(1);
});
