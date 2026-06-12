import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ForumService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findPosts(page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: posts, error, count } = await this.supabaseService
      .from('shen_forum_posts')
      .select('*, user:shen_users(nickname, avatar_url)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: posts ?? [],
      total: count ?? 0,
      page,
      limit,
    };
  }

  async findPostById(id: string) {
    const { data: post, error: postError } = await this.supabaseService
      .from('shen_forum_posts')
      .select('*, user:shen_users(nickname, avatar_url)')
      .eq('id', id)
      .single();

    if (postError || !post) {
      throw new NotFoundException(`Forum post ${id} not found`);
    }

    const { data: replies } = await this.supabaseService
      .from('shen_forum_replies')
      .select('*, user:shen_users(nickname, avatar_url)')
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    return {
      ...post,
      replies: replies ?? [],
    };
  }

  async createPost(userId: string, dto: { title: string; content: string }) {
    const { data: post, error } = await this.supabaseService
      .from('shen_forum_posts')
      .insert({
        user_id: userId,
        title: dto.title,
        content: dto.content,
      })
      .select('*, user:shen_users(nickname, avatar_url)')
      .single();

    if (error) throw error;

    return post;
  }

  async addReply(
    postId: string,
    userId: string,
    dto: { content: string },
  ) {
    // Verify the post exists
    const { data: post, error: postError } = await this.supabaseService
      .from('shen_forum_posts')
      .select('id, reply_count')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      throw new NotFoundException(`Forum post ${postId} not found`);
    }

    // Insert the reply
    const { data: reply, error: replyError } = await this.supabaseService
      .from('shen_forum_replies')
      .insert({
        post_id: postId,
        user_id: userId,
        content: dto.content,
      })
      .select('*, user:shen_users(nickname, avatar_url)')
      .single();

    if (replyError) throw replyError;

    // Increment reply_count on the post
    await this.supabaseService
      .from('shen_forum_posts')
      .update({ reply_count: (post.reply_count ?? 0) + 1 })
      .eq('id', postId);

    return reply;
  }

  async deletePost(postId: string, user: { userId: string; role: string }) {
    const { data: post, error: findError } = await this.supabaseService
      .from('shen_forum_posts')
      .select('user_id')
      .eq('id', postId)
      .single();

    if (findError || !post) {
      throw new NotFoundException(`Forum post ${postId} not found`);
    }

    // Admin can delete any post, normal user can only delete their own
    if (user.role !== 'admin' && post.user_id !== user.userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    // Delete associated replies first
    await this.supabaseService
      .from('shen_forum_replies')
      .delete()
      .eq('post_id', postId);

    const { error } = await this.supabaseService
      .from('shen_forum_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;

    return { message: 'Post deleted successfully' };
  }
}