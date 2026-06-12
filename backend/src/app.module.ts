import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { ForumModule } from './forum/forum.module';
import { GalleryModule } from './gallery/gallery.module';
import { GenerationModule } from './generation/generation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SupabaseModule,
    AuthModule,
    ArticlesModule,
    ForumModule,
    GalleryModule,
    GenerationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
