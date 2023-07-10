import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateDistanceAmountDto } from '../../dtos/distanceAmount.dto';
import { DistanceAmountService } from '../../services/distance-amount/distance-amount.service';

@Controller('distance-amount')
export class DistanceAmountController {
  constructor(private distanceAmountService: DistanceAmountService) {}

  @Get()
  async getAll() {
    return await this.distanceAmountService.getAll();
  }

  @Post()
  async create(@Body() payload: CreateDistanceAmountDto) {
    return await this.distanceAmountService.create(payload);
  }
}
