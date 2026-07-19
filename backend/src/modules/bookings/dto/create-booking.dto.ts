import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  teacherId!: string;

  @IsDateString()
  bookingDate!: string;

  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;

  @IsString()
  @MinLength(1)
  studentName!: string;

  @IsInt()
  @Min(1)
  studentAge!: number;

  @IsOptional()
  @IsString()
  learningGoals?: string;

  @IsOptional()
  @IsBoolean()
  isTrialLesson?: boolean;
}
