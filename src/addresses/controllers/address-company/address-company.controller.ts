import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  CreateAddressCompanyDto,
  UpdateAddressCompanyDto,
} from '../../dtos/addressCompany.dto';
import { AddressCompanyService } from '../../services/address-company/address-company.service';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';

@Controller('address-company')
export class AddressCompanyController {
  constructor(private addressCompanyService: AddressCompanyService) {}

  @Get('/company/:companyId')
  async findByCompanyId(@Param('companyId', MongoIdPipe) id: string) {
    return await this.addressCompanyService.findByCompanyId(id);
  }

  @Post()
  async create(@Body() payload: CreateAddressCompanyDto) {
    return await this.addressCompanyService.create(payload);
  }

  @Put('/:id')
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateAddressCompanyDto,
  ) {
    return await this.addressCompanyService.update(id, payload);
  }
}
