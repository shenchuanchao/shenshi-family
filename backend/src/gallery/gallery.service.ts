import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class GalleryService {
  private readonly BUCKET = 'shenshi-images';

  constructor(private readonly supabaseService: SupabaseService) {}

  /** Public list — only approved images */
  async findAll(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabaseService
      .from('shen_gallery_images')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data ?? [],
      total: count ?? 0,
      page,
      limit,
    };
  }

  /** Admin: pending images for review */
  async findPending(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabaseService
      .from('shen_gallery_images')
      .select('*', { count: 'exact' })
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data ?? [],
      total: count ?? 0,
      page,
      limit,
    };
  }

  /** Current user's own uploads (all statuses) */
  async findByUser(userId: string, page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabaseService
      .from('shen_gallery_images')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data ?? [],
      total: count ?? 0,
      page,
      limit,
    };
  }

  /** Admin: approve or reject an image */
  async review(
    imageId: string,
    action: 'approve' | 'reject',
    reason?: string,
  ) {
    const { data: image, error } = await this.supabaseService
      .from('shen_gallery_images')
      .select('id')
      .eq('id', imageId)
      .single();

    if (error || !image) {
      throw new NotFoundException(`Gallery image ${imageId} not found`);
    }

    const updates: Record<string, unknown> =
      action === 'approve'
        ? { status: 'approved', reject_reason: null }
        : { status: 'rejected', reject_reason: reason ?? null };

    const { data: updated, error: updateError } = await this.supabaseService
      .from('shen_gallery_images')
      .update(updates)
      .eq('id', imageId)
      .select()
      .single();

    if (updateError) throw updateError;

    return updated;
  }

  /** Delete an image — owner or admin */
  async remove(imageId: string, userId: string, userRole: string) {
    const { data: image, error } = await this.supabaseService
      .from('shen_gallery_images')
      .select('id, user_id, storage_path')
      .eq('id', imageId)
      .single();

    if (error || !image) {
      throw new NotFoundException(`Gallery image ${imageId} not found`);
    }

    const isAdmin = userRole === 'admin' || userRole === 'editor';
    if (image.user_id !== userId && !isAdmin) {
      throw new ForbiddenException('只能删除自己上传的图片');
    }

    // Remove from Supabase Storage (best-effort)
    if (image.storage_path) {
      const storage = this.supabaseService.getClient().storage;
      await storage.from(this.BUCKET).remove([image.storage_path]);
    }

    // Remove DB record
    const { error: deleteError } = await this.supabaseService
      .from('shen_gallery_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) throw deleteError;

    return { message: '删除成功' };
  }

  /** Upload a new image (status = pending) */
  async upload(
    userId: string,
    file: Express.Multer.File,
    description?: string,
  ) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const extension = this.extractExtension(file.originalname);
    const filePath = `gallery/${userId}/${timestamp}_${random}${extension}`;

    const storage = this.supabaseService.getClient().storage;

    // Ensure the bucket exists before uploading
    await this.ensureBucket(storage);

    // Upload file to Supabase Storage
    const { error: uploadError } = await storage
      .from(this.BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: urlData } = storage
      .from(this.BUCKET)
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Insert record — status defaults to 'pending'
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

    if (insertError) throw insertError;

    return image;
  }

  async toggleLike(imageId: string, _userId: string) {
    // MVP simplicity: increment likes by 1 each call
    const { data: image, error } = await this.supabaseService
      .from('shen_gallery_images')
      .select('likes')
      .eq('id', imageId)
      .single();

    if (error || !image) {
      throw new NotFoundException(`Gallery image ${imageId} not found`);
    }

    const newLikes = (image.likes ?? 0) + 1;

    const { data: updated, error: updateError } = await this.supabaseService
      .from('shen_gallery_images')
      .update({ likes: newLikes })
      .eq('id', imageId)
      .select()
      .single();

    if (updateError) throw updateError;

    return updated;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async ensureBucket(storage: any) {
    const { data: buckets } = await storage.listBuckets();
    const exists = buckets?.some((b) => b.name === this.BUCKET);
    if (!exists) {
      const { error } = await storage.createBucket(this.BUCKET, {
        public: true,
      });
      if (error) throw error;
    }
  }

  private extractExtension(filename: string): string {
    const dotIndex = filename.lastIndexOf('.');
    if (dotIndex === -1) return '.jpg';
    return filename.substring(dotIndex);
  }
}
