import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.constants';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 10;

  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user.
   */
  async register(dto: RegisterDto) {
    // Check if user already exists
    const { data: existing } = await this.supabase
      .from('shen_users')
      .select('id')
      .eq('email', dto.email)
      .maybeSingle();

    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    // Insert user
    const { data, error } = await this.supabase
      .from('shen_users')
      .insert({
        email: dto.email,
        password_hash: passwordHash,
        nickname: dto.nickname || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id, email, nickname, hometown, generation_verse, tanghao, avatar_url, created_at, updated_at')
      .single();

    if (error) {
      this.logger.error(`Failed to register user: ${error.message}`);
      throw new Error('Failed to register user');
    }

    return data;
  }

  /**
   * Authenticate a user and return a JWT token.
   */
  async login(dto: LoginDto) {
    // Find user by email
    const { data: user, error } = await this.supabase
      .from('shen_users')
      .select('*')
      .eq('email', dto.email)
      .maybeSingle();

    if (error) {
      this.logger.error(`Failed to query user: ${error.message}`);
      throw new Error('Failed to authenticate user');
    }

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT
    const payload = { sub: user.id, email: user.email, role: user.role || 'user' };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        hometown: user.hometown,
        generation_verse: user.generation_verse,
        tanghao: user.tanghao,
        avatar_url: user.avatar_url,
        role: user.role || 'user',
      },
    };
  }

  /**
   * Get user profile by ID.
   */
  async getProfile(userId: string) {
    const { data: user, error } = await this.supabase
      .from('shen_users')
      .select('id, email, nickname, hometown, generation_verse, tanghao, avatar_url, role, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user profile.
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Build update object with only provided fields
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (dto.nickname !== undefined) updates.nickname = dto.nickname;
    if (dto.hometown !== undefined) updates.hometown = dto.hometown;
    if (dto.generation_verse !== undefined) updates.generation_verse = dto.generation_verse;
    if (dto.tanghao !== undefined) updates.tanghao = dto.tanghao;
    if (dto.avatar_url !== undefined) updates.avatar_url = dto.avatar_url;

    const { data, error } = await this.supabase
      .from('shen_users')
      .update(updates)
      .eq('id', userId)
      .select('id, email, nickname, hometown, generation_verse, tanghao, avatar_url, role, created_at, updated_at')
      .single();

    if (error) {
      this.logger.error(`Failed to update profile: ${error.message}`);
      throw new Error('Failed to update profile');
    }

    return data;
  }
}
