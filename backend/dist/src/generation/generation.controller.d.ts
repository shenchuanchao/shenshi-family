import { GenerationService } from './generation.service';
export declare class GenerationController {
    private readonly generationService;
    constructor(generationService: GenerationService);
    getProvinces(): Promise<any[]>;
    getCities(province: string): Promise<any[]>;
    getCounties(province: string, city?: string): Promise<any[]>;
    queryVerses(province: string, city?: string, county?: string, verse?: string): Promise<any[]>;
    findAllTanghao(): import("./generation.service").Tanghao[];
}
