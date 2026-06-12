import { GalleryService } from './gallery.service';
import { UploadImageDto } from './dto/upload-image.dto';
export declare class GalleryController {
    private readonly galleryService;
    constructor(galleryService: GalleryService);
    findAll(page?: string, limit?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    upload(file: Express.Multer.File, dto: UploadImageDto, user: any): Promise<any>;
    toggleLike(id: string, user: any): Promise<any>;
}
