import { Body, Controller, Get, Post } from '@nestjs/common';
import { DiscountCodeService } from '../../services/discount-code/discount-code.service';
import { CreateDiscountCodeDto } from '../../dtos/discountCode.dto';

@Controller('discount-code')
export class DiscountCodeController {
  constructor(private discountCodeService: DiscountCodeService) {}

  @Get()
  async findAll() {
    return await this.discountCodeService.findAll();
  }

  @Post()
  async create(@Body() payload: CreateDiscountCodeDto) {
    return await this.discountCodeService.create(payload);
  }
}
