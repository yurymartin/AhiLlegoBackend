import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BusinessLineService } from './../../services/business-line/business-line.service';
import {
  CreateBusinessLineDto,
  UpdateBusinessLineDto,
} from './../../dtos/businessLine.dto';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';

@ApiTags('business-line')
@Controller('business-line')
export class BusinessLineController {
  constructor(private businessLineService: BusinessLineService) {}

  @Get()
  async findAll() {
    return await this.businessLineService.findAll();
  }

  @Get(':id')
  async finOne(@Param('id', MongoIdPipe) id: string) {
    return await this.businessLineService.findOne(id);
  }

  @Post()
  async create(@Body() payload: CreateBusinessLineDto) {
    return await this.businessLineService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateBusinessLineDto,
  ) {
    return await this.businessLineService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id', MongoIdPipe) id: string) {
    return await this.businessLineService.remove(id);
  }
}
