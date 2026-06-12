import { Controller, Get, Query } from '@nestjs/common';
import { GenerationService } from './generation.service';

@Controller()
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Get('generation/provinces')
  async getProvinces() {
    return this.generationService.getProvinces();
  }

  @Get('generation/cities')
  async getCities(@Query('province') province: string) {
    return this.generationService.getCities(province);
  }

  @Get('generation/counties')
  async getCounties(
    @Query('province') province: string,
    @Query('city') city?: string,
  ) {
    return this.generationService.getCounties(province, city);
  }

  @Get('generation/query')
  async queryVerses(
    @Query('province') province: string,
    @Query('city') city?: string,
    @Query('county') county?: string,
    @Query('verse') verse?: string,
  ) {
    return this.generationService.queryVerses({ province, city, county, verse });
  }

  @Get('tanghao')
  findAllTanghao() {
    return this.generationService.findAllTanghao();
  }
}
