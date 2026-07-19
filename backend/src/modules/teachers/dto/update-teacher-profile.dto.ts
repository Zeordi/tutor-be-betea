import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTeacherProfileDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;
}
