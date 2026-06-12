import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
