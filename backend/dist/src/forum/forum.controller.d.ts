import { ForumService } from './forum.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
export declare class ForumController {
    private readonly forumService;
    constructor(forumService: ForumService);
    findPosts(page?: string, limit?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    createPost(dto: CreatePostDto, user: any): Promise<any>;
    findPostById(id: string): Promise<any>;
    deletePost(id: string, user: any): Promise<{
        message: string;
    }>;
    addReply(id: string, dto: CreateReplyDto, user: any): Promise<any>;
}
