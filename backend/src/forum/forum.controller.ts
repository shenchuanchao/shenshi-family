import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Get('posts')
  async findPosts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.forumService.findPosts(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Body() dto: CreatePostDto,
    @CurrentUser() user: any,
  ) {
    return this.forumService.createPost(user.userId, dto);
  }

  @Get('posts/:id')
  async findPostById(@Param('id') id: string) {
    return this.forumService.findPostById(id);
  }

  @Delete('posts/:id')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.forumService.deletePost(id, user);
  }

  @Post('posts/:id/replies')
  @UseGuards(JwtAuthGuard)
  async addReply(
    @Param('id') id: string,
    @Body() dto: CreateReplyDto,
    @CurrentUser() user: any,
  ) {
    return this.forumService.addReply(id, user.userId, dto);
  }
}