import { IsString, IsUUID } from 'class-validator';

export class NotificationDto {
  @IsUUID()
  userId!: string;

  @IsString()
  title!: string;

  @IsString()
  body!: string;
}
