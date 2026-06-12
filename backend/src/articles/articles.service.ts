import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ArticlesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(category?: string, page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabaseService
      .from('shen_articles')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data ?? [],
      total: count ?? 0,
      page,
      limit,
    };
  }

  async findOne(
    id: string,
    user?: { userId: string; role: string },
  ) {
    const { data: article, error: articleError } = await this.supabaseService
      .from('shen_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (articleError || !article) {
      throw new NotFoundException(`Article ${id} not found`);
    }

    // Visibility: non-published articles are only visible to admin/editor or the author
    if (article.status && article.status !== 'published') {
      const isAdmin = user && (user.role === 'admin' || user.role === 'editor');
      const isAuthor = user && article.author_id === user.userId;
      if (!isAdmin && !isAuthor) {
        throw new NotFoundException(`Article ${id} not found`);
      }
    }

    // Increment view count
    await this.supabaseService
      .from('shen_articles')
      .update({ view_count: (article.view_count ?? 0) + 1 })
      .eq('id', id);

    // Check if the current user has liked this article
    let userLiked = false;
    if (user) {
      try {
        const { data: likeRecord, error: likeError } = await this.supabaseService
          .from('shen_article_likes')
          .select('id')
          .eq('article_id', id)
          .eq('user_id', user.userId)
          .maybeSingle();
        if (!likeError) {
          userLiked = !!likeRecord;
        }
      } catch {
        // Table may not exist yet — ignore
      }
    }

    // Fetch comments with user info (only for published articles)
    let comments: any[] = [];
    if (article.status === 'published' || !article.status) {
      const { data: commentData } = await this.supabaseService
        .from('shen_comments')
        .select('*, user:shen_users(nickname, avatar_url)')
        .eq('article_id', id)
        .order('created_at', { ascending: true });
      comments = commentData ?? [];
    }

    return {
      ...article,
      view_count: (article.view_count ?? 0) + 1,
      comments,
      user_liked: userLiked,
    };
  }

  async findDrafts(page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabaseService
      .from('shen_articles')
      .select('*', { count: 'exact' })
      .neq('status', 'published')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data ?? [],
      total: count ?? 0,
      page,
      limit,
    };
  }

  async findManage(user: { userId: string; role: string }, page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabaseService
      .from('shen_articles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    // Regular users see only their own articles; admin/editor see all
    if (user.role !== 'admin' && user.role !== 'editor') {
      query = query.eq('author_id', user.userId);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data ?? [],
      total: count ?? 0,
      page,
      limit,
    };
  }

  async toggleLike(articleId: string, userId: string) {
    // Check article exists
    const { data: article, error } = await this.supabaseService
      .from('shen_articles')
      .select('likes')
      .eq('id', articleId)
      .single();

    if (error || !article) {
      throw new NotFoundException(`Article ${articleId} not found`);
    }

    // Try to use shen_article_likes table for dedup tracking
    // If table doesn't exist yet, fall back to simple count increment
    let userLiked = false;
    let tableExists = false;

    try {
      const { data: existingLike, error: likeError } = await this.supabaseService
        .from('shen_article_likes')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_id', userId)
        .maybeSingle();

      if (!likeError) {
        tableExists = true;

        if (existingLike) {
          // Unlike: remove the like record and decrement count
          await this.supabaseService
            .from('shen_article_likes')
            .delete()
            .eq('id', existingLike.id);

          const newLikes = Math.max(0, (article.likes ?? 0) - 1);
          const { data: updated, error: updateError } = await this.supabaseService
            .from('shen_articles')
            .update({ likes: newLikes })
            .eq('id', articleId)
            .select()
            .single();

          if (updateError) throw updateError;
          return { ...updated, user_liked: false };
        } else {
          // Like: insert like record and increment count
          await this.supabaseService
            .from('shen_article_likes')
            .insert({ article_id: articleId, user_id: userId });

          const newLikes = (article.likes ?? 0) + 1;
          const { data: updated, error: updateError } = await this.supabaseService
            .from('shen_articles')
            .update({ likes: newLikes })
            .eq('id', articleId)
            .select()
            .single();

          if (updateError) throw updateError;
          return { ...updated, user_liked: true };
        }
      }
    } catch {
      // Table doesn't exist or other error — fall through to simple mode
    }

    // Fallback: simple increment (no dedup tracking)
    if (!tableExists) {
      const newLikes = (article.likes ?? 0) + 1;
      const { data: updated, error: updateError } = await this.supabaseService
        .from('shen_articles')
        .update({ likes: newLikes })
        .eq('id', articleId)
        .select()
        .single();

      if (updateError) throw updateError;
      return { ...updated, user_liked: false };
    }
  }

  async addComment(articleId: string, userId: string, content: string) {
    const { data: comment, error } = await this.supabaseService
      .from('shen_comments')
      .insert({ article_id: articleId, user_id: userId, content })
      .select('*, user:shen_users(nickname, avatar_url)')
      .single();

    if (error) throw error;

    return comment;
  }

  async create(
    data: {
      title: string;
      content: string;
      category: string;
      dynasty?: string;
      field?: string;
      cover_image?: string;
    },
    userId: string,
  ) {
    const { data: article, error } = await this.supabaseService
      .from('shen_articles')
      .insert({
        title: data.title,
        content: data.content,
        category: data.category,
        dynasty: data.dynasty || null,
        field: data.field || null,
        cover_image: data.cover_image || null,
        view_count: 0,
        likes: 0,
        status: 'published',
        author_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return article;
  }

  async submit(
    data: {
      title: string;
      content: string;
      category: string;
      dynasty?: string;
      field?: string;
      cover_image?: string;
    },
    userId: string,
  ) {
    const { data: article, error } = await this.supabaseService
      .from('shen_articles')
      .insert({
        title: data.title,
        content: data.content,
        category: data.category,
        dynasty: data.dynasty || null,
        field: data.field || null,
        cover_image: data.cover_image || null,
        view_count: 0,
        likes: 0,
        status: 'draft',
        author_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return article;
  }

  async review(
    articleId: string,
    action: 'approve' | 'reject',
    rejectReason?: string,
  ) {
    const { data: article, error: findError } = await this.supabaseService
      .from('shen_articles')
      .select('*')
      .eq('id', articleId)
      .single();

    if (findError || !article) {
      throw new NotFoundException(`Article ${articleId} not found`);
    }

    if (action === 'approve') {
      const { data: updated, error } = await this.supabaseService
        .from('shen_articles')
        .update({ status: 'published' })
        .eq('id', articleId)
        .select()
        .single();

      if (error) throw error;
      return updated;
    } else {
      // Reject: set back to draft with rejection note
      const { data: updated, error } = await this.supabaseService
        .from('shen_articles')
        .update({
          status: 'draft',
          // Store rejection reason as a comment on the article
        })
        .eq('id', articleId)
        .select()
        .single();

      if (error) throw error;

      // If rejection reason provided, add it as a system comment
      if (rejectReason) {
        await this.supabaseService
          .from('shen_comments')
          .insert({
            article_id: articleId,
            user_id: null,
            content: `[审核意见] ${rejectReason}`,
          });
      }

      return updated;
    }
  }

  async update(
    id: string,
    data: {
      title?: string;
      content?: string;
      category?: string;
      dynasty?: string;
      field?: string;
      cover_image?: string;
    },
    user: { userId: string; role: string },
  ) {
    // Check article exists and user has permission
    const { data: article, error: findError } = await this.supabaseService
      .from('shen_articles')
      .select('author_id, status')
      .eq('id', id)
      .single();

    if (findError || !article) {
      throw new NotFoundException(`Article ${id} not found`);
    }

    // Admin/editor can edit any article
    // Author can only edit their own draft articles
    if (user.role !== 'admin' && user.role !== 'editor') {
      if (article.author_id !== user.userId) {
        throw new ForbiddenException('You can only edit your own articles');
      }
      if (article.status === 'published') {
        throw new ForbiddenException('Published articles cannot be edited');
      }
    }

    const { data: updated, error } = await this.supabaseService
      .from('shen_articles')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!updated) {
      throw new NotFoundException(`Article ${id} not found`);
    }
    return updated;
  }

  async delete(articleId: string, user: { userId: string; role: string }) {
    const { data: article, error: findError } = await this.supabaseService
      .from('shen_articles')
      .select('author_id, status')
      .eq('id', articleId)
      .single();

    if (findError || !article) {
      throw new NotFoundException(`Article ${articleId} not found`);
    }

    // Admin can delete any article
    // Editor can delete any article
    // Author can only delete their own draft articles
    if (user.role !== 'admin' && user.role !== 'editor') {
      if (article.author_id !== user.userId) {
        throw new ForbiddenException('You can only delete your own articles');
      }
      if (article.status === 'published') {
        throw new ForbiddenException('Published articles cannot be deleted');
      }
    }

    // Delete associated comments first
    await this.supabaseService
      .from('shen_comments')
      .delete()
      .eq('article_id', articleId);

    const { error } = await this.supabaseService
      .from('shen_articles')
      .delete()
      .eq('id', articleId);

    if (error) throw error;

    return { message: 'Article deleted successfully' };
  }
}