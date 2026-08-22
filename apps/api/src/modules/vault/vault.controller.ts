import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { VaultService } from './vault.service';

@Controller('vault')
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  // Only Super Admins / Verification Officers can access
  @Post('upload')
  async uploadDocument() {
    // TODO: Accept encrypted upload of Fayda ID, Degree, Liveness selfie
    return { message: 'Document uploaded to encrypted vault' };
  }

  @Get(':id')
  async getDocument() {
    // TODO: Decrypt and return only to authorized admins
    return { message: 'Secure document access' };
  }
}
