import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    from(table: string): import("@supabase/postgrest-js").PostgrestQueryBuilder<any, any, any, string, unknown>;
    getClient(): SupabaseClient;
    rpc(fn: string, params?: Record<string, unknown>): import("@supabase/postgrest-js").PostgrestFilterBuilder<any, any, any, any, never, null, "RPC", false>;
}
