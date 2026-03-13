import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../generated/prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ example: 'สมชาย ใจดี' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: Role, example: Role.EVALUATEE })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
