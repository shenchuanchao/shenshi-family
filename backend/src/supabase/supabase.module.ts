import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { SUPABASE_CLIENT } from './supabase.constants';

@Global()
@Module({
  providers: [
    {
      provide: SUPABASE_CLIENT,
      useFactory: (configService: ConfigService): SupabaseClient => {
        const supabaseUrl = configService.get<string>('SUPABASE_URL');
        const supabaseKey = configService.get<string>('SUPABASE_SERVICE_KEY');

        if (!supabaseUrl || !supabaseKey) {
          throw new Error(
            'Supabase configuration is missing. Please check SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.',
          );
        }

        return createClient(supabaseUrl, supabaseKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        });
      },
      inject: [ConfigService],
    },
    SupabaseService,
  ],
  exports: [SUPABASE_CLIENT, SupabaseService],
})
export class SupabaseModule {}
