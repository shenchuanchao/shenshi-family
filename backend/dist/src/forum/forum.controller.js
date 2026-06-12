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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumController = void 0;
const common_1 = require("@nestjs/common");
const forum_service_1 = require("./forum.service");
const create_post_dto_1 = require("./dto/create-post.dto");
const create_reply_dto_1 = require("./dto/create-reply.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ForumController = class ForumController {
    forumService;
    constructor(forumService) {
        this.forumService = forumService;
    }
    async findPosts(page, limit) {
        return this.forumService.findPosts(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10);
    }
    async createPost(dto, user) {
        return this.forumService.createPost(user.userId, dto);
    }
    async findPostById(id) {
        return this.forumService.findPostById(id);
    }
    async deletePost(id, user) {
        return this.forumService.deletePost(id, user);
    }
    async addReply(id, dto, user) {
        return this.forumService.addReply(id, user.userId, dto);
    }
};
exports.ForumController = ForumController;
__decorate([
    (0, common_1.Get)('posts'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "findPosts", null);
__decorate([
    (0, common_1.Post)('posts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)('posts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "findPostById", null);
__decorate([
    (0, common_1.Delete)('posts/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "deletePost", null);
__decorate([
    (0, common_1.Post)('posts/:id/replies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_reply_dto_1.CreateReplyDto, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "addReply", null);
exports.ForumController = ForumController = __decorate([
    (0, common_1.Controller)('forum'),
    __metadata("design:paramtypes", [forum_service_1.ForumService])
], ForumController);
//# sourceMappingURL=forum.controller.js.map