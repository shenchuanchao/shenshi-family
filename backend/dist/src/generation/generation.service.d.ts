import { SupabaseService } from '../supabase/supabase.service';
export interface Tanghao {
    name: string;
    description: string;
}
export declare class GenerationService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    queryVerses(params: {
        province: string;
        city?: string;
        county?: string;
        verse?: string;
    }): Promise<any[]>;
    private queryVersesFallback;
    getProvinces(): Promise<any[]>;
    getCities(province: string): Promise<any[]>;
    getCounties(province: string, city?: string): Promise<any[]>;
    findAllTanghao(): Tanghao[];
}
