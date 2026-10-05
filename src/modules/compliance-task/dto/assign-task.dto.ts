import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignTaskDto {
  @IsNotEmpty({ message: 'Vui lòng cung cấp ID nhân viên phụ trách' })
  @IsNumber()
  user_id: number;
}
