import { IsEnum, IsOptional, IsString } from "class-validator";

enum UserRole {
  PARENT = "PARENT",
  TEACHER = "TEACHER",
}

export class GoogleAuthDto {
  @IsString()
  idToken!: string;

  /** Required only on first-time Google signup */
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}