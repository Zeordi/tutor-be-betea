import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { UserRole, UserStatus } from "@tutor/types";

interface CreateUserData {
  phoneNumber: string;
  fullName: string;
  role: UserRole;
  email?: string;
  passwordHash?: string;
  googleId?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

@Injectable()
export class UsersService {
  async create(data: CreateUserData) {
    return prisma.user.create({
      data: {
        phoneNumber: data.phoneNumber,
        fullName: data.fullName,
        role: data.role,
        email: data.email,
        passwordHash: data.passwordHash,
        googleId: data.googleId,
        emailVerified: data.emailVerified ?? false,
        phoneVerified: data.phoneVerified ?? false,
        status: "PENDING_VERIFICATION",
      },
    });
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { teacherProfile: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async findByPhone(phoneNumber: string) {
    return prisma.user.findUnique({
      where: { phoneNumber },
      include: { teacherProfile: true },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByGoogleId(googleId: string) {
    return prisma.user.findUnique({
      where: { googleId },
    });
  }

  async updateStatus(userId: string, status: UserStatus) {
    return prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  }

  async updateProfile(
    userId: string,
    data: {
      fullName?: string;
      email?: string;
      avatarUrl?: string;
      passwordHash?: string;
      googleId?: string;
      emailVerified?: boolean;
      phoneVerified?: boolean;
    },
  ) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async getAll(params?: {
    role?: UserRole;
    status?: UserStatus;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.role) where.role = params.role;
    if (params?.status) where.status = params.status;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { teacherProfile: true },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}