import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';
import { CreateAddressDto } from '../../dtos/address.dto';
import { AddressService } from '../../services/address/address.service';

interface IpayloadUpdate {
  addressId: string;
}

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Get('user/:id')
  async findByUserId(@Param('id', MongoIdPipe) id: string) {
    return await this.addressService.findByUserId(id);
  }

  @Get('user/active/:id')
  async findOneActiveByUserId(@Param('id', MongoIdPipe) id: string) {
    return await this.addressService.findOneActiveByUserId(id);
  }

  @Get('user/amount-delivery/:id')
  async getAmountDeliveryByUserId(@Param('id', MongoIdPipe) id: string) {
    return await this.addressService.findOneActiveByUserId(id);
  }

  @Post()
  async create(@Body() payload: CreateAddressDto) {
    return await this.addressService.create(payload);
  }

  @Put('user/:id')
  async updateStatusAddressCustomer(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: IpayloadUpdate,
  ) {
    return await this.addressService.updateStatusAddressCustomer(id, payload);
  }

  @Delete('/:id')
  async delete(@Param('id', MongoIdPipe) id: string) {
    return await this.addressService.delete(id);
  }
}
