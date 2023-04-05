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
import { StatusOrderService } from './../../services/status-order/status-order.service';
import {
  CreateStatusOrderDto,
  UpdateStatusOrderDto,
} from './../../dtos/statusOrder.dto';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';

@ApiTags('status-order')
@Controller('status-order')
export class StatusOrderController {
  constructor(private statusOrderService: StatusOrderService) {}

  @Get()
  async findAll() {
    return await this.statusOrderService.findAll();
  }

  @Get(':id')
  async finOne(@Param('id', MongoIdPipe) id: string) {
    return await this.statusOrderService.findOne(id);
  }

  @Get('/step/:step')
  async finOneByStep(@Param('step') step: string | number) {
    return await this.statusOrderService.findByStep(step);
  }

  @Post()
  async create(@Body() payload: CreateStatusOrderDto) {
    return await this.statusOrderService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateStatusOrderDto,
  ) {
    return await this.statusOrderService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id', MongoIdPipe) id: string) {
    return await this.statusOrderService.remove(id);
  }
}
