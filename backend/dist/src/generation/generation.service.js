"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let GenerationService = class GenerationService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async queryVerses(params) {
        const { province, city, county, verse } = params;
        let query = this.supabaseService
            .from('shen_generation_verses')
            .select('*')
            .eq('province', province)
            .order('branch_name', { ascending: true });
        if (city && city.trim()) {
            query = query.eq('city', city.trim());
        }
        if (county && county.trim()) {
            query = query.eq('county', county.trim());
        }
        if (verse && verse.trim()) {
            query = query.ilike('verses', `%${verse.trim()}%`);
        }
        const { data, error } = await query;
        if (error) {
            if (error.message?.includes('province') || error.code === 'PGRST204') {
                return this.queryVersesFallback(verse);
            }
            throw error;
        }
        return data ?? [];
    }
    async queryVersesFallback(verse) {
        let query = this.supabaseService
            .from('shen_generation_verses')
            .select('*')
            .order('branch_name', { ascending: true });
        if (verse && verse.trim()) {
            query = query.ilike('verses', `%${verse.trim()}%`);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return data ?? [];
    }
    async getProvinces() {
        const { data, error } = await this.supabaseService
            .from('shen_generation_verses')
            .select('province')
            .not('province', 'is', null)
            .order('province', { ascending: true });
        if (error) {
            if (error.message?.includes('province') || error.code === 'PGRST204') {
                return [];
            }
            throw error;
        }
        return [...new Set((data ?? []).map((r) => r.province).filter(Boolean))];
    }
    async getCities(province) {
        const { data, error } = await this.supabaseService
            .from('shen_generation_verses')
            .select('city')
            .eq('province', province)
            .not('city', 'is', null)
            .order('city', { ascending: true });
        if (error) {
            if (error.message?.includes('city') ||
                error.message?.includes('province') ||
                error.code === 'PGRST204') {
                return [];
            }
            throw error;
        }
        return [...new Set((data ?? []).map((r) => r.city).filter(Boolean))];
    }
    async getCounties(province, city) {
        let query = this.supabaseService
            .from('shen_generation_verses')
            .select('county')
            .eq('province', province)
            .not('county', 'is', null);
        if (city && city.trim()) {
            query = query.eq('city', city.trim());
        }
        query = query.order('county', { ascending: true });
        const { data, error } = await query;
        if (error) {
            if (error.message?.includes('county') ||
                error.message?.includes('city') ||
                error.message?.includes('province') ||
                error.code === 'PGRST204') {
                return [];
            }
            throw error;
        }
        return [...new Set((data ?? []).map((r) => r.county).filter(Boolean))];
    }
    findAllTanghao() {
        return [
            {
                name: '吴兴堂',
                description: '沈氏最著名的堂号，源自郡望吴兴郡（今浙江湖州），为沈氏正统堂号。',
            },
            {
                name: '三善堂',
                description: '源自宋代沈度任县令时的"三善"美名。',
            },
            {
                name: '梦溪堂',
                description: '纪念沈括著《梦溪笔谈》。',
            },
            {
                name: '清音堂',
                description: '纪念沈约的音韵学贡献。',
            },
            {
                name: '九如堂',
                description: '取《诗经》"如山如阜，如冈如陵"等九如之意，寓意家族昌盛。',
            },
            {
                name: '承志堂',
                description: '取继承先祖遗志之意，勉励后人传承家族精神。',
            },
            {
                name: '叙伦堂',
                description: '取叙人伦、明长幼之序，彰显家族礼教传统。',
            },
        ];
    }
};
exports.GenerationService = GenerationService;
exports.GenerationService = GenerationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], GenerationService);
//# sourceMappingURL=generation.service.js.map