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
import { TypeProductService } from './../../services/type-product/type-product.service';
import {
  CreateTypeProductDto,
  UpdateTypeProductDto,
} from './../../dtos/typeProduct.dto';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';

@ApiTags('type-product')
@Controller('type-product')
export class TypeProductController {
  constructor(private typeProductService: TypeProductService) {}

  @Get()
  async findAll() {
    return await this.typeProductService.findAll();
  }

  @Get(':id')
  async finOne(@Param('id', MongoIdPipe) id: string) {
    return await this.typeProductService.findOne(id);
  }

  @Post()
  async create(@Body() payload: CreateTypeProductDto) {
    return await this.typeProductService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateTypeProductDto,
  ) {
    return await this.typeProductService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id', MongoIdPipe) id: string) {
    return await this.typeProductService.remove(id);
  }
}
