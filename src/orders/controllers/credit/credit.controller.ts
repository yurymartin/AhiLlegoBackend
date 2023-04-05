import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreditService } from '../../services/credit/credit.service';
import { CreateCreditDto } from '../../dtos/credit.dto';

@Controller('credit')
export class CreditController {
  constructor(private creditService: CreditService) {}

  @Get()
  async findAll() {
    return await this.creditService.findAll();
  }

  @Post()
  async create(@Body() payload: CreateCreditDto) {
    return await this.creditService.create(payload);
  }

  @Post('/code')
  async createByCode(@Body() payload: CreateCreditDto) {
    return await this.creditService.createByCode(payload);
  }
}
