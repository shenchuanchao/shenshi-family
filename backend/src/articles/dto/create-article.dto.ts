import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['celebrity', 'genealogy', 'news', 'family_rules'])
  category: string;

  @IsOptional()
  @IsString()
  dynasty?: string;

  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  cover_image?: string;
}

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(['celebrity', 'genealogy', 'news', 'family_rules'])
  category?: string;

  @IsOptional()
  @IsString()
  dynasty?: string;

  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  cover_image?: string;
}
