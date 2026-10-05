import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { SeverityLevel, TaskStatus } from '../../../configs/constants.js';

export class FilterTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(SeverityLevel)
  severity?: SeverityLevel;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  assigned_to?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
