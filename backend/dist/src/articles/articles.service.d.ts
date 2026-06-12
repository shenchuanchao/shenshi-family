import { SupabaseService } from '../supabase/supabase.service';
export declare class ArticlesService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(category?: string, page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, user?: {
        userId: string;
        role: string;
    }): Promise<any>;
    findDrafts(page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findManage(user: {
        userId: string;
        role: string;
    }, page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    toggleLike(articleId: string, userId: string): Promise<any>;
    addComment(articleId: string, userId: string, content: string): Promise<any>;
    create(data: {
        title: string;
        content: string;
        category: string;
        dynasty?: string;
        field?: string;
        cover_image?: string;
    }, userId: string): Promise<any>;
    submit(data: {
        title: string;
        content: string;
        category: string;
        dynasty?: string;
        field?: string;
        cover_image?: string;
    }, userId: string): Promise<any>;
    review(articleId: string, action: 'approve' | 'reject', rejectReason?: string): Promise<any>;
    update(id: string, data: {
        title?: string;
        content?: string;
        category?: string;
        dynasty?: string;
        field?: string;
        cover_image?: string;
    }, user: {
        userId: string;
        role: string;
    }): Promise<any>;
    delete(articleId: string, user: {
        userId: string;
        role: string;
    }): Promise<{
        message: string;
    }>;
}
