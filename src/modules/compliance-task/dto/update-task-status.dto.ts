import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../../../configs/constants.js';

export class UpdateTaskStatusDto {
  @IsNotEmpty({ message: 'Vui lòng cung cấp trạng thái mới cho task' })
  @IsEnum(TaskStatus, { message: 'Trạng thái không hợp lệ' })
  status: TaskStatus;

  @IsOptional()
  @IsString()
  completion_note?: string;
}
