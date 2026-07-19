import { Body, Controller, Get, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { DisputeResolutionDto } from './dto/dispute-resolution.dto';
import { UserManagementDto } from './dto/user-management.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
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
  resolveDispute(@Body() dto: DisputeResolutionDto) {
    return this.adminService.resolveDispute(dto);
  }
}
