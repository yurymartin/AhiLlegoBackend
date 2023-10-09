import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DiscountCodeService } from '../../services/discount-code/discount-code.service';
import { CreateDiscountCodeDto } from '../../dtos/discountCode.dto';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';

@Controller('discount-code')
export class DiscountCodeController {
  constructor(private discountCodeService: DiscountCodeService) {}

  @Get()
  async findAll() {
    return await this.discountCodeService.findAll();
  }

  @Get('active/code/:code/user/:userId')
  async getActiveByCodeAndUser(
    @Param('code') code: string,
    @Param('userId', MongoIdPipe) userId: string,
  ) {
    return await this.discountCodeService.getActiveByCodeAndUser(code, userId);
  }

  @Post()
  async create(@Body() payload: CreateDiscountCodeDto) {
    return await this.discountCodeService.create(payload);
  }
}
