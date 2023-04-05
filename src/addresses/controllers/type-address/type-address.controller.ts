import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTypeAddressDto } from '../../dtos/typeAddress.dto';
import { TypeAddressService } from '../../services/type-address/type-address.service';

@Controller('type-address')
export class TypeAddressController {
  constructor(private typeAddressService: TypeAddressService) {}

  @Get()
  async findAll() {
    return await this.typeAddressService.findAll();
  }

  @Post()
  async create(@Body() payload: CreateTypeAddressDto) {
    return await this.typeAddressService.create(payload);
  }
}
