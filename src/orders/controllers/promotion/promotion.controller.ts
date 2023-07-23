import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePromotionDto } from './../../dtos/promotion.dto';
import { PromotionService } from '../../services/promotion/promotion.service';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';

@Controller('promotion')
export class PromotionController {
  constructor(private promotionService: PromotionService) {}

  @Get()
  async findAll() {
    return await this.promotionService.getAll();
  }

  @Get('/current')
  async getCurrent() {
    return await this.promotionService.getCurrent();
  }

  @Get('/current/user/:userId')
  async getCurrentByUserId(@Param('userId', MongoIdPipe) userId: string) {
    return await this.promotionService.getCurrentByUserId(userId);
  }

  @Post()
  async create(@Body() payload: CreatePromotionDto) {
    return await this.promotionService.create(payload);
  }
}
