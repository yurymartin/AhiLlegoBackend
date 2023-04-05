import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';
import { CreateTypeProductCompanyDto } from './../../dtos/typeProductCompany.dto';
import { TypeProductCompanyService } from '../../services/type-product-company/type-product-company.service';

@Controller('type-product-company')
export class TypeProductCompanyController {
  constructor(private typeProductCompanyService: TypeProductCompanyService) {}

  @Get()
  async findAll() {
    return await this.typeProductCompanyService.findAll();
  }

  @Get(':id')
  async finOne(@Param('id', MongoIdPipe) id: string) {
    return await this.typeProductCompanyService.findOne(id);
  }

  @Get('company/:id')
  async finByCompany(@Param('id', MongoIdPipe) id: string) {
    return await this.typeProductCompanyService.findByCompanyId(id);
  }

  @Post()
  async create(@Body() payload: CreateTypeProductCompanyDto) {
    return await this.typeProductCompanyService.create(payload);
  }
}
