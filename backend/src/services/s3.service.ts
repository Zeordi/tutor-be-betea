import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  constructor(private readonly config: ConfigService) {}

  async getUploadUrl(key: string) {
    const bucket = this.config.get<string>('AWS_S3_BUCKET') || 'betea-uploads';
    return `https://${bucket}.s3.amazonaws.com/${key}?upload=presigned`;
  }
}
