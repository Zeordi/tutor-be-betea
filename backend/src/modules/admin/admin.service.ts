import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { DisputeResolutionDto } from './dto/dispute-resolution.dto';
import { UserManagementDto } from './dto/user-management.dto';

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  listUsers() {
    return this.usersService.findAll();
  }

  listVerifications() {
    return [];
  }

  listDisputes() {
    return [];
  }

  manageUser(dto: UserManagementDto) {
    return { updated: true, ...dto };
  }

  resolveDispute(dto: DisputeResolutionDto) {
    return { resolved: true, ...dto };
  }
}
