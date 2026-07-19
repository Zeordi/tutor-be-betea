import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

type UserRecord = {
  id: string;
  email: string;
  name: string;
  role: string;
  passwordHash: string;
};

@Injectable()
export class UsersService {
  private users: UserRecord[] = [];

  async create(data: Omit<UserRecord, 'id'> & { id?: string }) {
    const user: UserRecord = {
      id: data.id || crypto.randomUUID(),
      email: data.email,
      name: data.name,
      role: data.role,
      passwordHash: data.passwordHash,
    };
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email) || null;
  }

  async findById(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async findAll() {
    return this.users.map(({ passwordHash: _, ...safe }) => safe);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    if (dto.name) user.name = dto.name;
    if (dto.email) user.email = dto.email;
    const { passwordHash: _, ...safe } = user;
    return safe;
  }
}
