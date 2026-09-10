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
  subCity?: string;
  addressLine?: string;
  emergencyContact?: string;
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
        subCity: data.subCity,
        addressLine: data.addressLine,
        emergencyContact: data.emergencyContact,
        status: "PENDING_VERIFICATION",
      },
    });
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        teacherProfile: true,
        children: true,
        subscriptions: {
          where: { active: true },
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
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
      emergencyContact?: string;
      addressLine?: string;
      subCity?: string;
      notificationPrefs?: any;
      pushToken?: string;
    },
  ) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        phoneNumber: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        avatarUrl: true,
        emergencyContact: true,
        addressLine: true,
        subCity: true,
        notificationPrefs: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getAll(params?: {
    role?: UserRole;
    status?: UserStatus;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.role) where.role = params.role;
    if (params?.status) where.status = params.status;
    if (params?.search) {
      where.OR = [
        { fullName: { contains: params.search, mode: "insensitive" } },
        { phoneNumber: { contains: params.search } },
        { email: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
          email: true,
          role: true,
          status: true,
          avatarUrl: true,
          subCity: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}