import { Controller, Post, Get, Patch, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser, CurrentUserPayload } from './decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'เข้าสู่ระบบ' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'ดูข้อมูลตัวเอง' })
  me(@CurrentUser() user: CurrentUserPayload) {
    return this.authService.me(user.id);
  }

  @Patch('me')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'แก้ไขข้อมูลตัวเอง (ชื่อ/email)' })
  updateMe(@CurrentUser() user: CurrentUserPayload, @Body() dto: UpdateMeDto) {
    return this.authService.updateMe(user.id, dto);
  }

  @Patch('me/password')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'เปลี่ยนรหัสผ่านตัวเอง' })
  changePassword(@CurrentUser() user: CurrentUserPayload, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(user.id, dto);
  }
}
