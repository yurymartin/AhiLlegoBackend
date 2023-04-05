import { Body, Controller, Post } from '@nestjs/common';
import { CreateAddressCompanyDto } from '../../dtos/addressCompany.dto';
import { AddressCompanyService } from '../../services/address-company/address-company.service';

@Controller('address-company')
export class AddressCompanyController {
  constructor(private addressCompanyService: AddressCompanyService) {}

  @Post()
  async create(@Body() payload: CreateAddressCompanyDto) {
    return await this.addressCompanyService.create(payload);
  }
}
