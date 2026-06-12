"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let ArticlesService = class ArticlesService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async findAll(category, page = 1, limit = 10) {
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
        if (error)
            throw error;
        return {
            data: data ?? [],
            total: count ?? 0,
            page,
            limit,
        };
    }
    async findOne(id, user) {
        const { data: article, error: articleError } = await this.supabaseService
            .from('shen_articles')
            .select('*')
            .eq('id', id)
            .single();
        if (articleError || !article) {
            throw new common_1.NotFoundException(`Article ${id} not found`);
        }
        if (article.status && article.status !== 'published') {
            const isAdmin = user && (user.role === 'admin' || user.role === 'editor');
            const isAuthor = user && article.author_id === user.userId;
            if (!isAdmin && !isAuthor) {
                throw new common_1.NotFoundException(`Article ${id} not found`);
            }
        }
        await this.supabaseService
            .from('shen_articles')
            .update({ view_count: (article.view_count ?? 0) + 1 })
            .eq('id', id);
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
            }
            catch {
            }
        }
        let comments = [];
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
        if (error)
            throw error;
        return {
            data: data ?? [],
            total: count ?? 0,
            page,
            limit,
        };
    }
    async findManage(user, page = 1, limit = 20) {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        let query = this.supabaseService
            .from('shen_articles')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);
        if (user.role !== 'admin' && user.role !== 'editor') {
            query = query.eq('author_id', user.userId);
        }
        const { data, error, count } = await query;
        if (error)
            throw error;
        return {
            data: data ?? [],
            total: count ?? 0,
            page,
            limit,
        };
    }
    async toggleLike(articleId, userId) {
        const { data: article, error } = await this.supabaseService
            .from('shen_articles')
            .select('likes')
            .eq('id', articleId)
            .single();
        if (error || !article) {
            throw new common_1.NotFoundException(`Article ${articleId} not found`);
        }
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
                    if (updateError)
                        throw updateError;
                    return { ...updated, user_liked: false };
                }
                else {
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
                    if (updateError)
                        throw updateError;
                    return { ...updated, user_liked: true };
                }
            }
        }
        catch {
        }
        if (!tableExists) {
            const newLikes = (article.likes ?? 0) + 1;
            const { data: updated, error: updateError } = await this.supabaseService
                .from('shen_articles')
                .update({ likes: newLikes })
                .eq('id', articleId)
                .select()
                .single();
            if (updateError)
                throw updateError;
            return { ...updated, user_liked: false };
        }
    }
    async addComment(articleId, userId, content) {
        const { data: comment, error } = await this.supabaseService
            .from('shen_comments')
            .insert({ article_id: articleId, user_id: userId, content })
            .select('*, user:shen_users(nickname, avatar_url)')
            .single();
        if (error)
            throw error;
        return comment;
    }
    async create(data, userId) {
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
        if (error)
            throw error;
        return article;
    }
    async submit(data, userId) {
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
        if (error)
            throw error;
        return article;
    }
    async review(articleId, action, rejectReason) {
        const { data: article, error: findError } = await this.supabaseService
            .from('shen_articles')
            .select('*')
            .eq('id', articleId)
            .single();
        if (findError || !article) {
            throw new common_1.NotFoundException(`Article ${articleId} not found`);
        }
        if (action === 'approve') {
            const { data: updated, error } = await this.supabaseService
                .from('shen_articles')
                .update({ status: 'published' })
                .eq('id', articleId)
                .select()
                .single();
            if (error)
                throw error;
            return updated;
        }
        else {
            const { data: updated, error } = await this.supabaseService
                .from('shen_articles')
                .update({
                status: 'draft',
            })
                .eq('id', articleId)
                .select()
                .single();
            if (error)
                throw error;
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
    async update(id, data, user) {
        const { data: article, error: findError } = await this.supabaseService
            .from('shen_articles')
            .select('author_id, status')
            .eq('id', id)
            .single();
        if (findError || !article) {
            throw new common_1.NotFoundException(`Article ${id} not found`);
        }
        if (user.role !== 'admin' && user.role !== 'editor') {
            if (article.author_id !== user.userId) {
                throw new common_1.ForbiddenException('You can only edit your own articles');
            }
            if (article.status === 'published') {
                throw new common_1.ForbiddenException('Published articles cannot be edited');
            }
        }
        const { data: updated, error } = await this.supabaseService
            .from('shen_articles')
            .update(data)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        if (!updated) {
            throw new common_1.NotFoundException(`Article ${id} not found`);
        }
        return updated;
    }
    async delete(articleId, user) {
        const { data: article, error: findError } = await this.supabaseService
            .from('shen_articles')
            .select('author_id, status')
            .eq('id', articleId)
            .single();
        if (findError || !article) {
            throw new common_1.NotFoundException(`Article ${articleId} not found`);
        }
        if (user.role !== 'admin' && user.role !== 'editor') {
            if (article.author_id !== user.userId) {
                throw new common_1.ForbiddenException('You can only delete your own articles');
            }
            if (article.status === 'published') {
                throw new common_1.ForbiddenException('Published articles cannot be deleted');
            }
        }
        await this.supabaseService
            .from('shen_comments')
            .delete()
            .eq('article_id', articleId);
        const { error } = await this.supabaseService
            .from('shen_articles')
            .delete()
            .eq('id', articleId);
        if (error)
            throw error;
        return { message: 'Article deleted successfully' };
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map