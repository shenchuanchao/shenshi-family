"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_constants_1 = require("../supabase/supabase.constants");
let AuthService = AuthService_1 = class AuthService {
    supabase;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    SALT_ROUNDS = 10;
    constructor(supabase, jwtService) {
        this.supabase = supabase;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const { data: existing } = await this.supabase
            .from('shen_users')
            .select('id')
            .eq('email', dto.email)
            .maybeSingle();
        if (existing) {
            throw new common_1.ConflictException('A user with this email already exists');
        }
        const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
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
    async login(dto) {
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
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
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
    async getProfile(userId) {
        const { data: user, error } = await this.supabase
            .from('shen_users')
            .select('id, email, nickname, hometown, generation_verse, tanghao, avatar_url, role, created_at, updated_at')
            .eq('id', userId)
            .single();
        if (error || !user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateProfile(userId, dto) {
        const updates = {
            updated_at: new Date().toISOString(),
        };
        if (dto.nickname !== undefined)
            updates.nickname = dto.nickname;
        if (dto.hometown !== undefined)
            updates.hometown = dto.hometown;
        if (dto.generation_verse !== undefined)
            updates.generation_verse = dto.generation_verse;
        if (dto.tanghao !== undefined)
            updates.tanghao = dto.tanghao;
        if (dto.avatar_url !== undefined)
            updates.avatar_url = dto.avatar_url;
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_constants_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map