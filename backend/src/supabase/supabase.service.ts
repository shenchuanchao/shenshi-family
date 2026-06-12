import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './supabase.constants';

@Injectable()
export class SupabaseService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  /**
   * Returns a query builder for the specified table.
   */
  from(table: string) {
    return this.supabase.from(table);
  }

  /**
   * Returns the raw Supabase client for advanced operations.
   */
  getClient(): SupabaseClient {
    return this.supabase;
  }

  /**
   * Execute a raw SQL query via Supabase REST RPC.
   */
  rpc(fn: string, params?: Record<string, unknown>) {
    return this.supabase.rpc(fn as never, params as never);
  }
}
