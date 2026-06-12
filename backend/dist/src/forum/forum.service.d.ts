import { SupabaseService } from '../supabase/supabase.service';
export declare class ForumService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    findPosts(page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findPostById(id: string): Promise<any>;
    createPost(userId: string, dto: {
        title: string;
        content: string;
    }): Promise<any>;
    addReply(postId: string, userId: string, dto: {
        content: string;
    }): Promise<any>;
    deletePost(postId: string, user: {
        userId: string;
        role: string;
    }): Promise<{
        message: string;
    }>;
}
