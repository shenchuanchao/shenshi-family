import { SupabaseService } from '../supabase/supabase.service';
export declare class GalleryService {
    private readonly supabaseService;
    private readonly BUCKET;
    constructor(supabaseService: SupabaseService);
    findAll(page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    upload(userId: string, file: Express.Multer.File, description?: string): Promise<any>;
    toggleLike(imageId: string, _userId: string): Promise<any>;
    private extractExtension;
}
