import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class GalleryService {
  private readonly BUCKET = 'shenshi-images';

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabaseService
      .from('shen_gallery_images')
      .select('*', { count: 'exact' })
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

    // Insert record into gallery_images
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
