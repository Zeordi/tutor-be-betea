import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    if (!id) return null;
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { teacherProfile: true },
    });
    if (!user) return null;
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { teacherProfile: true },
    });
    return users.map(({ passwordHash: _, ...safe }) => safe);
  }

  async update(id: string, dto: UpdateUserDto) {
    if (!id) throw new NotFoundException('User not found');
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.fullName != null ? { fullName: dto.fullName } : {}),
        ...(dto.email != null ? { email: dto.email } : {}),
        ...(dto.phone != null ? { phone: dto.phone } : {}),
        ...(dto.profileImage != null ? { profileImage: dto.profileImage } : {}),
      },
    });
    const { passwordHash: _, ...safe } = user;
    return safe;
  }
}
