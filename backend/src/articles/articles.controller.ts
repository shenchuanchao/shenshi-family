import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateArticleDto, UpdateArticleDto } from './dto/create-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(@Query() query: QueryArticlesDto) {
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    return this.articlesService.findAll(query.category, page, limit);
  }

  @Get('drafts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async findDrafts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.articlesService.findDrafts(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('manage')
  @UseGuards(JwtAuthGuard)
  async findManage(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.articlesService.findManage(
      user,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.articlesService.findOne(id, user ?? undefined);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async create(@Body() dto: CreateArticleDto, @CurrentUser() user: any) {
    return this.articlesService.create(dto, user.userId);
  }

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  async submit(@Body() dto: CreateArticleDto, @CurrentUser() user: any) {
    return this.articlesService.submit(dto, user.userId);
  }

  @Post(':id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async review(
    @Param('id') id: string,
    @Body() body: { action: 'approve' | 'reject'; reason?: string },
  ) {
    return this.articlesService.review(id, body.action, body.reason);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateArticleDto,
    @CurrentUser() user: any,
  ) {
    return this.articlesService.update(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.articlesService.delete(id, user);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.articlesService.toggleLike(id, user.userId);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.articlesService.addComment(id, user.userId, dto.content);
  }
}