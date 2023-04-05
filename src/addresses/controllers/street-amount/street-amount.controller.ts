import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';
import { CreateStreetAmountDto } from '../../dtos/streetAmount.dto';
import { StreetAmountService } from '../../services/street-amount/street-amount.service';

@Controller('street-amount')
export class StreetAmountController {
  constructor(private streetAmountService: StreetAmountService) {}

  @Get()
  async findAll() {
    return await this.streetAmountService.findAll();
  }

  @Post()
  async create(@Body() payload: CreateStreetAmountDto) {
    return await this.streetAmountService.create(payload);
  }

  @Get('/amount/:userId/:companyId')
  async findAmountDelivery(
    @Param('userId', MongoIdPipe) userId: string,
    @Param('companyId', MongoIdPipe) companyId: string,
  ) {
    return await this.streetAmountService.findAmountDelivery(userId, companyId);
  }
}
