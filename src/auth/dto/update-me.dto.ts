import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateMeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
