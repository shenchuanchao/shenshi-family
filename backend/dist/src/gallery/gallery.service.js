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
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let GalleryService = class GalleryService {
    supabaseService;
    BUCKET = 'shenshi-images';
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async findAll(page = 1, limit = 20) {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, error, count } = await this.supabaseService
            .from('shen_gallery_images')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);
        if (error)
            throw error;
        return {
            data: data ?? [],
            total: count ?? 0,
            page,
            limit,
        };
    }
    async upload(userId, file, description) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 10);
        const extension = this.extractExtension(file.originalname);
        const filePath = `gallery/${userId}/${timestamp}_${random}${extension}`;
        const storage = this.supabaseService.getClient().storage;
        const { error: uploadError } = await storage
            .from(this.BUCKET)
            .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });
        if (uploadError)
            throw uploadError;
        const { data: urlData } = storage
            .from(this.BUCKET)
            .getPublicUrl(filePath);
        const publicUrl = urlData.publicUrl;
        const { data: image, error: insertError } = await this.supabaseService
            .from('shen_gallery_images')
            .insert({
            user_id: userId,
            image_url: publicUrl,
            storage_path: filePath,
            description: description ?? null,
        })
            .select()
            .single();
        if (insertError)
            throw insertError;
        return image;
    }
    async toggleLike(imageId, _userId) {
        const { data: image, error } = await this.supabaseService
            .from('shen_gallery_images')
            .select('likes')
            .eq('id', imageId)
            .single();
        if (error || !image) {
            throw new common_1.NotFoundException(`Gallery image ${imageId} not found`);
        }
        const newLikes = (image.likes ?? 0) + 1;
        const { data: updated, error: updateError } = await this.supabaseService
            .from('shen_gallery_images')
            .update({ likes: newLikes })
            .eq('id', imageId)
            .select()
            .single();
        if (updateError)
            throw updateError;
        return updated;
    }
    extractExtension(filename) {
        const dotIndex = filename.lastIndexOf('.');
        if (dotIndex === -1)
            return '.jpg';
        return filename.substring(dotIndex);
    }
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], GalleryService);
//# sourceMappingURL=gallery.service.js.map