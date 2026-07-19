import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { DisputeResolutionDto } from './dto/dispute-resolution.dto';
import { UserManagementDto } from './dto/user-management.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  users() {
    return this.adminService.listUsers();
  }

  @Get('verifications')
  verifications() {
    return this.adminService.listVerifications();
  }

  @Get('disputes')
  disputes() {
    return this.adminService.listDisputes();
  }

  @Patch('users')
  manageUser(@Body() dto: UserManagementDto) {
    return this.adminService.manageUser(dto);
  }

  @Patch('disputes')
  resolveDispute(@Req() req: { user?: { id: string } }, @Body() dto: DisputeResolutionDto) {
    return this.adminService.resolveDispute(req.user?.id || '', dto);
  }
}
