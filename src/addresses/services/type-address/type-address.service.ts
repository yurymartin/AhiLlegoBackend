import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTypeAddressDto } from '../../../addresses/dtos/typeAddress.dto';
import { TypeAddress } from '../../schemas/typeAddress.schema';

@Injectable()
export class TypeAddressService {
  constructor(
    @InjectModel(TypeAddress.name)
    private readonly typeAddressModel: Model<TypeAddress>,
  ) {}

  async findAll() {
    const typeProducts = await this.typeAddressModel.find().exec();
    return typeProducts;
  }

  async findOne(id: string) {
    const typeProduct = await this.typeAddressModel.findOne({ id: id }).exec();
    if (!typeProduct) {
      throw new NotFoundException('No existe el tipo de dirección');
    }
    return typeProduct;
  }

  async create(data: CreateTypeAddressDto) {
    const newTypeAddress = new this.typeAddressModel(data);
    const typeAddressSave = await newTypeAddress.save();
    return typeAddressSave;
  }
}
