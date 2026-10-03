import { NestFactory } from '@nestjs/core';
import { AppModule } from '../dist/app.module.js';
import { TransformResponseInterceptor } from '../dist/core/interceptors/transform-response.interceptor.js';
import { AllExceptionFilter } from '../dist/core/filters/all-exception.filter.js';
import { ValidationPipe } from '@nestjs/common';
import mysql from 'mysql2/promise';

async function runE2ESmokeSuite() {
  console.log('================================================================');
  console.log('🚀 BẮT ĐẦU CHẠY SUITE KIỂM THỬ LIÊN THÔNG E2E KHUNG SƯỜN CELRA');
  console.log('================================================================');

  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());

  const TEST_PORT = 3105;
  await app.listen(TEST_PORT);
  const baseURL = `http://127.0.0.1:${TEST_PORT}`;
  console.log(`📡 Máy chủ test đang lắng nghe tại: ${baseURL}\n`);

  const results = [];

  try {
    // -------------------------------------------------------------
    // KỊCH BẢN 1: Đăng ký 2 Doanh nghiệp Độc lập (Self-serve Registration)
    // -------------------------------------------------------------
    console.log('▶ KỊCH BẢN 1: Đăng ký 2 Doanh nghiệp tự phục vụ');

    const companyAPayload = {
      company_name: 'Tập đoàn Nông nghiệp Công nghệ cao Cần Thơ',
      tax_code: '1809990001',
      company_email: 'contact@agricantho.vn',
      company_phone: '02923999111',
      address: 'Khu Công nghệ cao, Q. Bình Thủy, TP Cần Thơ',
      username: 'admin_agrican_tho',
      email: 'admin@agricantho.vn',
      password: 'SecurePassword123@',
      full_name: 'Trần Văn Nông Nghiệp',
      phone: '0909111222',
    };

    const resRegA = await fetch(`${baseURL}/auth/register-company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyAPayload),
    });
    const jsonRegA = await resRegA.json();
    console.log('Phản hồi Đăng ký A:', JSON.stringify(jsonRegA, null, 2));
    if (!jsonRegA.data) {
      throw new Error(`Đăng ký A thất bại: ${jsonRegA.message}`);
    }
    const companyAId = jsonRegA.data.company.id;
    console.log(`  [Pass] Đăng ký Công ty A thành công - ID: ${companyAId}`);

    const companyBPayload = {
      company_name: 'Công ty TNHH Chế biến Thủy hải sản Sóc Trăng',
      tax_code: '2209990002',
      company_email: 'contact@soctrangseafood.vn',
      company_phone: '02993888222',
      address: 'KCN An Nghiệp, H. Châu Thành, Sóc Trăng',
      username: 'admin_soctrangsea',
      email: 'admin@soctrangseafood.vn',
      password: 'SecurePassword123@',
      full_name: 'Lâm Thị Thủy Sản',
      phone: '0909333444',
    };

    const resRegB = await fetch(`${baseURL}/auth/register-company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyBPayload),
    });
    const jsonRegB = await resRegB.json();
    const companyBId = jsonRegB.data.company.id;
    console.log(`  [Pass] Đăng ký Công ty B thành công - ID: ${companyBId}`);

    if (companyAId === companyBId) {
      throw new Error('Lỗi: ID hai công ty bị trùng nhau!');
    }
    results.push({ name: 'Kịch bản 1: Đăng ký 2 Doanh nghiệp tự phục vụ', status: 'PASS' });

    // -------------------------------------------------------------
    // Đăng nhập lấy Token cho cả 2 Công ty
    // -------------------------------------------------------------
    const loginARes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'admin_agrican_tho',
        password: 'SecurePassword123@',
      }),
    });
    const tokenA = (await loginARes.json()).data.accessToken;

    const loginBRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'admin_soctrangsea',
        password: 'SecurePassword123@',
      }),
    });
    const tokenB = (await loginBRes.json()).data.accessToken;

    // Lấy Role COMPANY_STAFF
    const rolesRes = await fetch(`${baseURL}/rbac/roles`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const staffRole = (await rolesRes.json()).data.find((r) => r.code === 'COMPANY_STAFF');

    // -------------------------------------------------------------
    // KỊCH BẢN 2: Cấp tài khoản Nhân viên nội bộ (Employee Provisioning)
    // -------------------------------------------------------------
    console.log('\n▶ KỊCH BẢN 2: Cấp tài khoản Nhân viên nội bộ');

    const resEmpA1 = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        username: 'staff_ct_01',
        email: 'staff01@agricantho.vn',
        password: 'StaffInitPassword123@',
        full_name: 'Nguyễn Kỹ Thuật CanTho',
        phone: '0912111111',
        role_id: staffRole.id,
      }),
    });
    const jsonEmpA1 = await resEmpA1.json();
    const empA1 = jsonEmpA1.data;
    console.log(`  [Pass] Tạo nhân viên A1 (ID: ${empA1.id}) gán company_id = ${empA1.company_id}`);

    const resEmpB1 = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({
        username: 'staff_st_01',
        email: 'staff01@soctrangseafood.vn',
        password: 'StaffInitPassword123@',
        full_name: 'Trần Kế Toán SocTrang',
        phone: '0912222222',
        role_id: staffRole.id,
      }),
    });
    const jsonEmpB1 = await resEmpB1.json();
    const empB1 = jsonEmpB1.data;
    console.log(`  [Pass] Tạo nhân viên B1 (ID: ${empB1.id}) gán company_id = ${empB1.company_id}`);

    if (empA1.company_id !== companyAId || empB1.company_id !== companyBId) {
      throw new Error('Lỗi: Nhân viên không được gán đúng company_id từ JWT token!');
    }
    results.push({ name: 'Kịch bản 2: Cấp tài khoản Nhân viên nội bộ', status: 'PASS' });

    // -------------------------------------------------------------
    // KỊCH BẢN 3: Kiểm tra Cô lập Dữ liệu Đa người thuê (Tenant Isolation)
    // -------------------------------------------------------------
    console.log('\n▶ KỊCH BẢN 3: Kiểm tra Cô lập Dữ liệu Đa người thuê');

    // Công ty A lấy danh sách nhân viên
    const resListA = await fetch(`${baseURL}/users`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const listA = (await resListA.json()).data;
    console.log(`  Nhân sự thuộc Công ty A: ${listA.map((u) => u.username).join(', ')}`);

    const hasLeakInA = listA.some((u) => u.company_id !== companyAId || u.username === 'staff_st_01');
    if (hasLeakInA) {
      throw new Error('NGHIÊM TRỌNG: Công ty A nhìn thấy tài khoản của Công ty B!');
    }

    // Công ty B lấy danh sách nhân viên
    const resListB = await fetch(`${baseURL}/users`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const listB = (await resListB.json()).data;
    console.log(`  Nhân sự thuộc Công ty B: ${listB.map((u) => u.username).join(', ')}`);

    const hasLeakInB = listB.some((u) => u.company_id !== companyBId || u.username === 'staff_ct_01');
    if (hasLeakInB) {
      throw new Error('NGHIÊM TRỌNG: Công ty B nhìn thấy tài khoản của Công ty A!');
    }

    // Công ty A cố tình gửi request sửa thông tin nhân viên B1 của Công ty B
    const resTamper = await fetch(`${baseURL}/users/${empB1.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ full_name: 'Tên Đã Bị Hack' }),
    });
    const jsonTamper = await resTamper.json();
    console.log(`  [Pass] Chặn sửa chéo dữ liệu giữa các tenant: Mã ${jsonTamper.code}`);
    if (jsonTamper.code !== 404 && jsonTamper.code !== 403) {
      throw new Error('LỖ HỔNG: Công ty A sửa được tài khoản của Công ty B!');
    }
    results.push({ name: 'Kịch bản 3: Cô lập Dữ liệu Đa người thuê', status: 'PASS' });

    // -------------------------------------------------------------
    // KỊCH BẢN 4: Kiểm tra Phân quyền RBAC (Role-Based Access Control)
    // -------------------------------------------------------------
    console.log('\n▶ KỊCH BẢN 4: Kiểm tra Phân quyền RBAC');

    // Đăng nhập bằng tài khoản Nhân viên A1
    const resLoginEmp = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'staff_ct_01',
        password: 'StaffInitPassword123@',
      }),
    });
    const tokenEmpA1 = (await resLoginEmp.json()).data.accessToken;

    // Nhân viên A1 có quyền employee:view -> gọi xem danh sách: THÀNH CÔNG
    const resStaffView = await fetch(`${baseURL}/users`, {
      headers: { Authorization: `Bearer ${tokenEmpA1}` },
    });
    if ((await resStaffView.json()).code !== 200) {
      throw new Error('Nhân viên A1 không xem được danh sách');
    }
    console.log('  [Pass] Nhân viên thường có quyền employee:view -> Xem được danh sách');

    // Nhân viên A1 KHÔNG có quyền employee:create -> cố tình gọi tạo nhân viên -> BỊ CHẶN 403
    const resStaffCreate = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenEmpA1}`,
      },
      body: JSON.stringify({
        username: 'staff_illegal',
        email: 'illegal@agricantho.vn',
        password: 'Password123@',
        full_name: 'Tạo Trộm',
        role_id: staffRole.id,
      }),
    });
    const jsonStaffCreate = await resStaffCreate.json();
    console.log(`  [Pass] Chặn 403 Forbidden khi thiếu quyền employee:create (Mã: ${jsonStaffCreate.code})`);
    if (jsonStaffCreate.code !== 403) {
      throw new Error('LỖ HỔNG RBAC: Nhân viên thường tạo được nhân viên mới!');
    }
    results.push({ name: 'Kịch bản 4: Phân quyền RBAC 2 lớp', status: 'PASS' });

    // -------------------------------------------------------------
    // KỊCH BẢN 5: Vòng đời Khôi phục Mật khẩu (Forgot & Reset Password)
    // -------------------------------------------------------------
    console.log('\n▶ KỊCH BẢN 5: Vòng đời Khôi phục Mật khẩu');

    // Yêu cầu quên mật khẩu
    await fetch(`${baseURL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'staff01@agricantho.vn' }),
    });

    // Lấy token từ CSDL
    const db = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'celra_db',
    });
    const [tokens] = await db.query(
      'SELECT token FROM password_resets WHERE email = ? AND is_used = 0 ORDER BY id DESC LIMIT 1',
      ['staff01@agricantho.vn'],
    );
    const resetToken = tokens[0]?.token;
    console.log(`  [Pass] Đã sinh và lưu Token 15 phút: ${resetToken.slice(0, 16)}...`);

    // Thực hiện đặt mật khẩu mới
    const resReset = await fetch(`${baseURL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetToken,
        new_password: 'BrandNewPassword789@',
      }),
    });
    if ((await resReset.json()).code !== 200) {
      throw new Error('Đặt lại mật khẩu thất bại');
    }
    console.log('  [Pass] Đặt lại mật khẩu mới thành công');

    // Thử đăng nhập mật khẩu cũ -> 401
    const resOldLogin = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'staff_ct_01',
        password: 'StaffInitPassword123@',
      }),
    });
    if ((await resOldLogin.json()).code !== 401) {
      throw new Error('Lỗi bảo mật: Mật khẩu cũ vẫn hoạt động sau khi reset');
    }
    console.log('  [Pass] Mật khẩu cũ bị vô hiệu hóa chính xác (401 Unauthorized)');

    // Thử đăng nhập mật khẩu mới -> 200
    const resNewLogin = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'staff_ct_01',
        password: 'BrandNewPassword789@',
      }),
    });
    if ((await resNewLogin.json()).code !== 200) {
      throw new Error('Đăng nhập bằng mật khẩu mới thất bại');
    }
    console.log('  [Pass] Đăng nhập bằng mật khẩu mới thành công rực rỡ');
    await db.end();

    results.push({ name: 'Kịch bản 5: Vòng đời Khôi phục Mật khẩu', status: 'PASS' });

    console.log('\n================================================================');
    console.log('🏆 TỔNG HỢP KẾT QUẢ KIỂM THỬ E2E KHUNG SƯỜN CELRA:');
    results.forEach((r, idx) => {
      console.log(`  ${idx + 1}. [${r.status}] ${r.name}`);
    });
    console.log('================================================================');
  } finally {
    await app.close();
  }
}

runE2ESmokeSuite().catch((err) => {
  console.error('❌ Kiểm thử thất bại:', err);
  process.exit(1);
});
