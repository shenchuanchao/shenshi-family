import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default-secret'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, RolesGuard],
  exports: [ArticlesService],
})
export class ArticlesModule {}
