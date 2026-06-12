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
exports.GenerationController = void 0;
const common_1 = require("@nestjs/common");
const generation_service_1 = require("./generation.service");
let GenerationController = class GenerationController {
    generationService;
    constructor(generationService) {
        this.generationService = generationService;
    }
    async getProvinces() {
        return this.generationService.getProvinces();
    }
    async getCities(province) {
        return this.generationService.getCities(province);
    }
    async getCounties(province, city) {
        return this.generationService.getCounties(province, city);
    }
    async queryVerses(province, city, county, verse) {
        return this.generationService.queryVerses({ province, city, county, verse });
    }
    findAllTanghao() {
        return this.generationService.findAllTanghao();
    }
};
exports.GenerationController = GenerationController;
__decorate([
    (0, common_1.Get)('generation/provinces'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GenerationController.prototype, "getProvinces", null);
__decorate([
    (0, common_1.Get)('generation/cities'),
    __param(0, (0, common_1.Query)('province')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GenerationController.prototype, "getCities", null);
__decorate([
    (0, common_1.Get)('generation/counties'),
    __param(0, (0, common_1.Query)('province')),
    __param(1, (0, common_1.Query)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GenerationController.prototype, "getCounties", null);
__decorate([
    (0, common_1.Get)('generation/query'),
    __param(0, (0, common_1.Query)('province')),
    __param(1, (0, common_1.Query)('city')),
    __param(2, (0, common_1.Query)('county')),
    __param(3, (0, common_1.Query)('verse')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], GenerationController.prototype, "queryVerses", null);
__decorate([
    (0, common_1.Get)('tanghao'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GenerationController.prototype, "findAllTanghao", null);
exports.GenerationController = GenerationController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [generation_service_1.GenerationService])
], GenerationController);
//# sourceMappingURL=generation.controller.js.map