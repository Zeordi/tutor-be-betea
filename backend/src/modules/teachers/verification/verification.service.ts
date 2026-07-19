import { Injectable } from '@nestjs/common';
import { VerificationDto } from './dto/verification.dto';

@Injectable()
export class VerificationService {
  private status = { status: 'UNVERIFIED' as string, documentUrl: '' };

  getStatus() {
    return this.status;
  }

  submit(dto: VerificationDto) {
    this.status = { status: 'PENDING', documentUrl: dto.documentUrl };
    return this.status;
  }
}
