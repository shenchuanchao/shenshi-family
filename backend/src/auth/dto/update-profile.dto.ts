import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  hometown?: string;

  @IsString()
  @IsOptional()
  generation_verse?: string;

  @IsString()
  @IsOptional()
  tanghao?: string;

  @IsString()
  @IsOptional()
  avatar_url?: string;
}
