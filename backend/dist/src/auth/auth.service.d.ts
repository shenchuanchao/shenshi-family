import { JwtService } from '@nestjs/jwt';
import { SupabaseClient } from '@supabase/supabase-js';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthService {
    private readonly supabase;
    private readonly jwtService;
    private readonly logger;
    private readonly SALT_ROUNDS;
    constructor(supabase: SupabaseClient, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        id: any;
        email: any;
        nickname: any;
        hometown: any;
        generation_verse: any;
        tanghao: any;
        avatar_url: any;
        created_at: any;
        updated_at: any;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            nickname: any;
            hometown: any;
            generation_verse: any;
            tanghao: any;
            avatar_url: any;
            role: any;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: any;
        email: any;
        nickname: any;
        hometown: any;
        generation_verse: any;
        tanghao: any;
        avatar_url: any;
        role: any;
        created_at: any;
        updated_at: any;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: any;
        email: any;
        nickname: any;
        hometown: any;
        generation_verse: any;
        tanghao: any;
        avatar_url: any;
        role: any;
        created_at: any;
        updated_at: any;
    }>;
}
