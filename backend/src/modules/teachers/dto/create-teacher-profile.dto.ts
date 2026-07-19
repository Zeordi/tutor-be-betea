import { IsArray, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTeacherProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsArray()
  @IsString({ each: true })
  subjects!: string[];

  @IsNumber()
  @Min(0)
  hourlyRate!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  experienceYears?: number;
}
