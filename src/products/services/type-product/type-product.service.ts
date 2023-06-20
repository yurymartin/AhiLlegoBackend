import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TypeProduct } from '../../schemas/typeProduct.schema';
import {
  CreateTypeProductDto,
  UpdateTypeProductDto,
} from '../../dtos/typeProduct.dto';

@Injectable()
export class TypeProductService {
  constructor(
    @InjectModel(TypeProduct.name)
    private readonly typeProductModel: Model<TypeProduct>,
  ) {}

  async findAll() {
    const typeProducts = await this.typeProductModel
      .find({ status: true })
      .exec();
    return typeProducts;
  }

  async findOne(id: string | any) {
    const typeProduct = await this.typeProductModel.findOne({ _id: id }).exec();
    if (!typeProduct) {
      throw new NotFoundException(`No se encontro el tipo de producto`);
    }
    return typeProduct;
  }

  async create(data: CreateTypeProductDto) {
    const newTypeProduct = new this.typeProductModel(data);
    const typeProductSave = await newTypeProduct.save();
    return typeProductSave;
  }

  async update(id: string, changes: UpdateTypeProductDto) {
    const typeProduct = await this.typeProductModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!typeProduct) {
      throw new NotFoundException(`No se encontro el tipo de producto`);
    }
    return typeProduct;
  }

  async remove(id: string) {
    const typeProduct = await this.typeProductModel.findOne({ _id: id }).exec();
    if (!typeProduct) {
      throw new NotFoundException(`No se encontro el tipo de producto`);
    }
    const typeProducRemove = await this.typeProductModel.findByIdAndDelete(id);
    return typeProducRemove;
  }
}
