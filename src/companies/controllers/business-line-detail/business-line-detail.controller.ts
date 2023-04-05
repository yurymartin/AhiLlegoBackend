import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BusinessLineDetailService } from '../../services/business-line-detail/business-line-detail.service';
import { CreateBusinessLineDetailDto } from '../../dtos/businessLineDetail.dto';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';

@Controller('business-line-detail')
export class BusinessLineDetailController {
  constructor(private businessLineDetailService: BusinessLineDetailService) {}

  @Get()
  async finAll() {
    return await this.businessLineDetailService.findAll();
  }

  @Get('/business-line/:id')
  async findByBusinessLine(@Param('id', MongoIdPipe) id: string) {
    return await this.businessLineDetailService.findByBusinessLine(id);
  }

  @Post()
  async create(@Body() payload: CreateBusinessLineDetailDto) {
    return await this.businessLineDetailService.create(payload);
  }
}
