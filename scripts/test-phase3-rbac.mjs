import { NestFactory } from '@nestjs/core';
import { AppModule } from '../dist/app.module.js';
import { TransformResponseInterceptor } from '../dist/core/interceptors/transform-response.interceptor.js';
import { AllExceptionFilter } from '../dist/core/filters/all-exception.filter.js';
import { ValidationPipe } from '@nestjs/common';

async function runTest() {
  console.log('🚀 Khởi động máy chủ kiểm thử Phase 3...');
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

  await app.listen(3098);
  const baseURL = 'http://127.0.0.1:3098';
  console.log(`✅ Server test listening at ${baseURL}`);

  try {
    // 1. Kiểm tra chặn truy cập khi chưa đăng nhập
    console.log('\n--- 1. Kiểm thử GET /users khi chưa đăng nhập (kỳ vọng 401) ---');
    const unauthRes = await fetch(`${baseURL}/users`);
    const unauthJson = await unauthRes.json();
    console.log('Chặn 401 thành công:', unauthJson.code === 401);
    if (unauthJson.code !== 401) {
      throw new Error('Lỗi: Chưa đăng nhập vẫn truy cập được /users');
    }

    // 2. Đăng ký Công ty A
    console.log('\n--- 2. Đăng ký & Đăng nhập Công ty A (Lúa Vàng) ---');
    const compARes = await fetch(`${baseURL}/auth/register-company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_name: 'Công ty CP Lúa Vàng An Giang',
        tax_code: '8888111222',
        company_email: 'contact@luavangangiang.vn',
        username: 'admin_luavang',
        email: 'admin@luavangangiang.vn',
        password: 'PassWord123@',
        full_name: 'Trần Văn Lúa',
      }),
    });
    const compAJson = await compARes.json();
    const companyAId = compAJson.data.company.id;
    console.log(`Công ty A tạo thành công với ID: ${companyAId}`);

    const loginARes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'admin_luavang',
        password: 'PassWord123@',
      }),
    });
    const loginAJson = await loginARes.json();
    const tokenA = loginAJson.data.accessToken;

    // 3. Đăng ký Công ty B
    console.log('\n--- 3. Đăng ký & Đăng nhập Công ty B (Thủy Sản Bạc Liêu) ---');
    const compBRes = await fetch(`${baseURL}/auth/register-company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_name: 'Công ty TNHH Thủy Sản Bạc Liêu',
        tax_code: '9999333444',
        company_email: 'contact@thuysanbaclieu.vn',
        username: 'admin_baclieu',
        email: 'admin@thuysanbaclieu.vn',
        password: 'PassWord123@',
        full_name: 'Lê Thị Tôm',
      }),
    });
    const compBJson = await compBRes.json();
    const companyBId = compBJson.data.company.id;
    console.log(`Công ty B tạo thành công với ID: ${companyBId}`);

    const loginBRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'admin_baclieu',
        password: 'PassWord123@',
      }),
    });
    const loginBJson = await loginBRes.json();
    const tokenB = loginBJson.data.accessToken;

    // 4. Lấy danh sách Roles có thể gán
    console.log('\n--- 4. Kiểm thử GET /rbac/roles ---');
    const rolesRes = await fetch(`${baseURL}/rbac/roles`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const rolesJson = await rolesRes.json();
    console.log('Roles có thể gán:', rolesJson.data);
    const staffRole = rolesJson.data.find((r) => r.code === 'COMPANY_STAFF');
    const hasSysAdmin = rolesJson.data.some((r) => r.code === 'SYSTEM_ADMIN');
    if (!staffRole || hasSysAdmin) {
      throw new Error('Danh mục roles không hợp lệ hoặc để lộ SYSTEM_ADMIN');
    }
    console.log('✅ Chặn lộ SYSTEM_ADMIN trong danh mục vai trò thành công');

    // 5. Công ty A tạo Nhân viên A1
    console.log('\n--- 5. Công ty A tạo Nhân viên A1 ---');
    const createA1Res = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        username: 'staff_luavang_1',
        email: 'staff1@luavangangiang.vn',
        password: 'StaffPassword123@',
        full_name: 'Nguyễn Văn Nhân Viên A1',
        phone: '0912345678',
        role_id: staffRole.id,
      }),
    });
    const createA1Json = await createA1Res.json();
    console.log('Nhân viên A1 tạo thành công:', createA1Json.data);
    const staffA1Id = createA1Json.data.id;
    if (createA1Json.data.company_id !== companyAId) {
      throw new Error('Lỗi: Nhân viên A1 không được gán đúng company_id của Công ty A');
    }

    // 6. Công ty B tạo Nhân viên B1
    console.log('\n--- 6. Công ty B tạo Nhân viên B1 ---');
    const createB1Res = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({
        username: 'staff_baclieu_1',
        email: 'staff1@thuysanbaclieu.vn',
        password: 'StaffPassword123@',
        full_name: 'Phạm Văn Nhân Viên B1',
        phone: '0987654321',
        role_id: staffRole.id,
      }),
    });
    const createB1Json = await createB1Res.json();
    console.log('Nhân viên B1 tạo thành công:', createB1Json.data);
    const staffB1Id = createB1Json.data.id;
    if (createB1Json.data.company_id !== companyBId) {
      throw new Error('Lỗi: Nhân viên B1 không được gán đúng company_id của Công ty B');
    }

    // 7. Kiểm tra Cô lập Dữ liệu (Tenant Isolation)
    console.log('\n--- 7. Kiểm tra Cô lập Dữ liệu giữa Công ty A và Công ty B ---');
    const listARes = await fetch(`${baseURL}/users`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const listAJson = await listARes.json();
    const usersInA = listAJson.data;
    console.log(`Số lượng nhân sự Công ty A: ${usersInA.length}`);
    const leakInA = usersInA.some((u) => u.company_id !== companyAId || u.username === 'staff_baclieu_1');
    if (leakInA) {
      throw new Error('RÒ RỈ DỮ LIỆU: Công ty A nhìn thấy nhân sự của Công ty B!');
    }
    console.log('✅ Công ty A chỉ thấy nhân sự của chính mình (100% CÔ LẬP)');

    const listBRes = await fetch(`${baseURL}/users`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const listBJson = await listBRes.json();
    const usersInB = listBJson.data;
    console.log(`Số lượng nhân sự Công ty B: ${usersInB.length}`);
    const leakInB = usersInB.some((u) => u.company_id !== companyBId || u.username === 'staff_luavang_1');
    if (leakInB) {
      throw new Error('RÒ RỈ DỮ LIỆU: Công ty B nhìn thấy nhân sự của Công ty A!');
    }
    console.log('✅ Công ty B chỉ thấy nhân sự của chính mình (100% CÔ LẬP)');

    // 8. Kiểm tra Chặn sửa chéo dữ liệu giữa các công ty
    console.log('\n--- 8. Công ty A cố tình sửa thông tin nhân viên B1 của Công ty B ---');
    const crossEditRes = await fetch(`${baseURL}/users/${staffB1Id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ full_name: 'Hacked Name' }),
    });
    const crossEditJson = await crossEditRes.json();
    console.log('Chặn sửa chéo (kỳ vọng 404/403):', crossEditJson.code);
    if (crossEditJson.code !== 404 && crossEditJson.code !== 403) {
      throw new Error('Lỗ hổng bảo mật: Công ty A sửa được nhân viên của Công ty B!');
    }
    console.log('✅ Chặn sửa chéo dữ liệu thành công!');

    // 9. Kiểm tra Phân quyền RBAC (Role COMPANY_STAFF bị chặn tạo nhân viên)
    console.log('\n--- 9. Đăng nhập tài khoản Nhân viên A1 và kiểm tra quyền RBAC ---');
    const loginStaffRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'staff_luavang_1',
        password: 'StaffPassword123@',
      }),
    });
    const loginStaffJson = await loginStaffRes.json();
    const tokenStaffA1 = loginStaffJson.data.accessToken;
    console.log('Nhân viên A1 đăng nhập thành công. Role:', loginStaffJson.data.user.role);

    // Nhân viên A1 gọi xem danh sách: được phép
    const staffViewRes = await fetch(`${baseURL}/users`, {
      headers: { Authorization: `Bearer ${tokenStaffA1}` },
    });
    const staffViewJson = await staffViewRes.json();
    if (staffViewJson.code !== 200) {
      throw new Error('Nhân viên A1 không xem được danh sách');
    }
    console.log('✅ Nhân viên A1 có quyền employee:view -> Xem được danh sách');

    // Nhân viên A1 cố tình tạo thêm nhân viên: BỊ CHẶN 403
    const staffCreateRes = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenStaffA1}`,
      },
      body: JSON.stringify({
        username: 'staff_a2',
        email: 'staffa2@luavang.vn',
        password: 'Password123@',
        full_name: 'Staff A2',
        role_id: staffRole.id,
      }),
    });
    const staffCreateJson = await staffCreateRes.json();
    console.log('Chặn 403 khi nhân viên thiếu quyền employee:create:', staffCreateJson.code === 403);
    if (staffCreateJson.code !== 403) {
      throw new Error('Lỗ hổng RBAC: Nhân viên thường không có quyền tạo nhân sự nhưng vẫn tạo được!');
    }
    console.log('✅ PermissionsGuard chặn 403 Forbidden chính xác!');

    console.log('\n🎉 TẤT CẢ 9 BÀI KIỂM THỬ PHASE 3 ĐÃ VƯỢT QUA 100%! 🎉');
  } finally {
    await app.close();
  }
}

runTest().catch((err) => {
  console.error('❌ Kiểm thử Phase 3 thất bại:', err);
  process.exit(1);
});
