import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { Role } from '../generated/prisma/client';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@Controller('users')
@Roles(Role.SUPERADMIN, Role.ADMIN)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'ดูรายชื่อผู้ใช้ทั้งหมด (ADMIN, SUPERADMIN)' })
  @ApiQuery({ name: 'role', enum: Role, required: false })
  findAll(@Query('role') role?: Role) {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดูข้อมูลผู้ใช้ตาม ID (ADMIN, SUPERADMIN)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'สร้างผู้ใช้ใหม่พร้อมกำหนด role (ADMIN, SUPERADMIN)' })
  create(@Body() dto: CreateUserDto, @CurrentUser() user: CurrentUserPayload) {
    return this.usersService.create(dto, user.role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลผู้ใช้ (ADMIN, SUPERADMIN)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.usersService.update(id, dto, user.role);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบผู้ใช้ (ADMIN, SUPERADMIN)' })
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.usersService.remove(id, user.role, user.id);
  }
}
