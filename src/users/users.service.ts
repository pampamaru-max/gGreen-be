import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly selectFields = {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  };

  async findAll(role?: Role) {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      select: this.selectFields,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.selectFields,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto, requestorRole: Role) {
    const targetRole = dto.role ?? Role.EVALUATEE;

    // ADMIN cannot create SUPERADMIN or another ADMIN
    if (requestorRole === Role.ADMIN && (targetRole === Role.SUPERADMIN || targetRole === Role.ADMIN)) {
      throw new ForbiddenException('ADMIN cannot create SUPERADMIN or ADMIN accounts');
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: targetRole,
      },
      select: this.selectFields,
    });
  }

  async update(id: string, dto: UpdateUserDto, requestorRole: Role) {
    const target = await this.findOne(id);

    // ADMIN cannot modify SUPERADMIN or ADMIN accounts
    if (requestorRole === Role.ADMIN && (target.role === Role.SUPERADMIN || target.role === Role.ADMIN)) {
      throw new ForbiddenException('ADMIN cannot modify SUPERADMIN or ADMIN accounts');
    }

    // ADMIN cannot promote anyone to SUPERADMIN or ADMIN
    if (requestorRole === Role.ADMIN && dto.role && (dto.role === Role.SUPERADMIN || dto.role === Role.ADMIN)) {
      throw new ForbiddenException('ADMIN cannot assign SUPERADMIN or ADMIN roles');
    }

    const data: Record<string, unknown> = {};
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.password) data.password = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.update({
      where: { id },
      data,
      select: this.selectFields,
    });
  }

  async remove(id: string, requestorRole: Role, requestorId: string) {
    const target = await this.findOne(id);

    if (target.id === requestorId) throw new ForbiddenException('Cannot delete your own account');
    if (requestorRole === Role.ADMIN && (target.role === Role.SUPERADMIN || target.role === Role.ADMIN)) {
      throw new ForbiddenException('ADMIN cannot delete SUPERADMIN or ADMIN accounts');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
