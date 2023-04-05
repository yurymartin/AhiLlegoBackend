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
import { TypePayService } from './../../services/type-pay/type-pay.service';
import { CreateTypePayDto, UpdateTypePayDto } from './../../dtos/typePay.dto';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';

@ApiTags('type-pay')
@Controller('type-pay')
export class TypePayController {
  constructor(private typePayService: TypePayService) {}

  @Get()
  async findAll() {
    return await this.typePayService.findAll();
  }

  @Get(':id')
  async finOne(@Param('id', MongoIdPipe) id: string) {
    return await this.typePayService.findOne(id);
  }

  @Post()
  async create(@Body() payload: CreateTypePayDto) {
    return await this.typePayService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateTypePayDto,
  ) {
    return await this.typePayService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id', MongoIdPipe) id: string) {
    return await this.typePayService.remove(id);
  }
}
