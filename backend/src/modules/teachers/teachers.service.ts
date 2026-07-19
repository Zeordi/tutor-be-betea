import { Injectable } from '@nestjs/common';
import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';

@Injectable()
export class TeachersService {
  private teachers: Array<CreateTeacherProfileDto & { id: string }> = [];

  findAll(q?: string) {
    if (!q) return this.teachers;
    const needle = q.toLowerCase();
    return this.teachers.filter(
      (t) =>
        t.bio?.toLowerCase().includes(needle) ||
        t.subjects.some((s) => s.toLowerCase().includes(needle)),
    );
  }

  findOne(id: string) {
    return this.teachers.find((t) => t.id === id) || null;
  }

  create(dto: CreateTeacherProfileDto) {
    const teacher = { id: crypto.randomUUID(), ...dto };
    this.teachers.push(teacher);
    return teacher;
  }

  update(dto: UpdateTeacherProfileDto) {
    const teacher = this.teachers.find((t) => t.id === dto.id);
    if (!teacher) return null;
    Object.assign(teacher, dto);
    return teacher;
  }
}
