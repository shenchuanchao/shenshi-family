import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UploadService {
  private readonly BUCKET = 'shenshi-images';

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Upload a file to Supabase Storage and return the public URL.
   * Files are stored under: articles/{userId}/{timestamp}_{random}{ext}
   */
  async uploadImage(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请选择要上传的图片');
    }

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('只能上传图片文件');
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('图片大小不能超过 10MB');
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const extension = this.extractExtension(file.originalname);
    const filePath = `articles/${userId}/${timestamp}_${random}${extension}`;

    const storage = this.supabaseService.getClient().storage;

    // Ensure bucket exists
    await this.ensureBucket(storage);

    // Upload file
    const { error: uploadError } = await storage
      .from(this.BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = storage
      .from(this.BUCKET)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
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
