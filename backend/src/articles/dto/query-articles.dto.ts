import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class QueryArticlesDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
