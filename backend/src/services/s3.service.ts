import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

export type PresignedUpload = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  expiresIn: number;
};

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3: AWS.S3 | null;
  private readonly bucket: string;
  private readonly region: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.get<string>('AWS_S3_BUCKET') || '';
    this.region = this.config.get<string>('AWS_REGION') || 'us-east-1';
    const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID') || '';
    const secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY') || '';

    if (this.bucket && accessKeyId && secretAccessKey) {
      this.s3 = new AWS.S3({
        region: this.region,
        accessKeyId,
        secretAccessKey,
        signatureVersion: 'v4',
      });
      this.logger.log(`S3Service ready (bucket=${this.bucket}, region=${this.region})`);
    } else {
      this.s3 = null;
      this.logger.warn(
        'S3 not fully configured — set AWS_S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY',
      );
    }
  }

  isConfigured() {
    return Boolean(this.s3 && this.bucket);
  }

  async createPresignedUpload(input: {
    key: string;
    contentType: string;
    expiresIn?: number;
  }): Promise<PresignedUpload> {
    if (!this.s3 || !this.bucket) {
      throw new BadRequestException(
        'S3 uploads are not configured. Set AWS_S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY on the API.',
      );
    }

    const expiresIn = input.expiresIn ?? 300;
    const uploadUrl = await this.s3.getSignedUrlPromise('putObject', {
      Bucket: this.bucket,
      Key: input.key,
      ContentType: input.contentType,
      Expires: expiresIn,
    });

    const publicUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${input.key}`;

    return {
      uploadUrl,
      publicUrl,
      key: input.key,
      expiresIn,
    };
  }

  async createPresignedDownload(key: string, expiresIn = 900) {
    if (!this.s3 || !this.bucket) {
      throw new BadRequestException('S3 is not configured');
    }
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresIn,
    });
  }
}
