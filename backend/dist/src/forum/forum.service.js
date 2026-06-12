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
exports.ForumService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let ForumService = class ForumService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async findPosts(page = 1, limit = 10) {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data: posts, error, count } = await this.supabaseService
            .from('shen_forum_posts')
            .select('*, user:shen_users(nickname, avatar_url)', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);
        if (error)
            throw error;
        return {
            data: posts ?? [],
            total: count ?? 0,
            page,
            limit,
        };
    }
    async findPostById(id) {
        const { data: post, error: postError } = await this.supabaseService
            .from('shen_forum_posts')
            .select('*, user:shen_users(nickname, avatar_url)')
            .eq('id', id)
            .single();
        if (postError || !post) {
            throw new common_1.NotFoundException(`Forum post ${id} not found`);
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
    async createPost(userId, dto) {
        const { data: post, error } = await this.supabaseService
            .from('shen_forum_posts')
            .insert({
            user_id: userId,
            title: dto.title,
            content: dto.content,
        })
            .select('*, user:shen_users(nickname, avatar_url)')
            .single();
        if (error)
            throw error;
        return post;
    }
    async addReply(postId, userId, dto) {
        const { data: post, error: postError } = await this.supabaseService
            .from('shen_forum_posts')
            .select('id, reply_count')
            .eq('id', postId)
            .single();
        if (postError || !post) {
            throw new common_1.NotFoundException(`Forum post ${postId} not found`);
        }
        const { data: reply, error: replyError } = await this.supabaseService
            .from('shen_forum_replies')
            .insert({
            post_id: postId,
            user_id: userId,
            content: dto.content,
        })
            .select('*, user:shen_users(nickname, avatar_url)')
            .single();
        if (replyError)
            throw replyError;
        await this.supabaseService
            .from('shen_forum_posts')
            .update({ reply_count: (post.reply_count ?? 0) + 1 })
            .eq('id', postId);
        return reply;
    }
    async deletePost(postId, user) {
        const { data: post, error: findError } = await this.supabaseService
            .from('shen_forum_posts')
            .select('user_id')
            .eq('id', postId)
            .single();
        if (findError || !post) {
            throw new common_1.NotFoundException(`Forum post ${postId} not found`);
        }
        if (user.role !== 'admin' && post.user_id !== user.userId) {
            throw new common_1.ForbiddenException('You can only delete your own posts');
        }
        await this.supabaseService
            .from('shen_forum_replies')
            .delete()
            .eq('post_id', postId);
        const { error } = await this.supabaseService
            .from('shen_forum_posts')
            .delete()
            .eq('id', postId);
        if (error)
            throw error;
        return { message: 'Post deleted successfully' };
    }
};
exports.ForumService = ForumService;
exports.ForumService = ForumService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ForumService);
//# sourceMappingURL=forum.service.js.map