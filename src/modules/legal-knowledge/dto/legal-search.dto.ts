import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class LegalSearchDto {
  @IsNotEmpty({ message: 'Vui lòng cung cấp nội dung truy vấn tìm kiếm' })
  @IsString()
  query: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 5;
}
