import { ArticlesService } from './articles.service';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateArticleDto, UpdateArticleDto } from './dto/create-article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    findAll(query: QueryArticlesDto): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findDrafts(page?: string, limit?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findManage(user: any, page?: string, limit?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, user: any): Promise<any>;
    create(dto: CreateArticleDto, user: any): Promise<any>;
    submit(dto: CreateArticleDto, user: any): Promise<any>;
    review(id: string, body: {
        action: 'approve' | 'reject';
        reason?: string;
    }): Promise<any>;
    update(id: string, dto: UpdateArticleDto, user: any): Promise<any>;
    delete(id: string, user: any): Promise<{
        message: string;
    }>;
    toggleLike(id: string, user: any): Promise<any>;
    addComment(id: string, dto: CreateCommentDto, user: any): Promise<any>;
}
