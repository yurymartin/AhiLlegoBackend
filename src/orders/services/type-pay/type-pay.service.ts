import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TypePay } from '../../schemas/typePay.schema';
import { CreateTypePayDto, UpdateTypePayDto } from '../../dtos/typePay.dto';

@Injectable()
export class TypePayService {
  constructor(
    @InjectModel(TypePay.name)
    private readonly typePayModel: Model<TypePay>,
  ) {}

  async findAll() {
    const typePaies = await this.typePayModel
      .find()
      .select('-createdAt -updatedAt -__v')
      .exec();
    return typePaies;
  }

  async findOne(id: string) {
    const typePay = await this.typePayModel
      .findOne({ _id: id })
      .select('-createdAt -updatedAt -__v')
      .exec();
    if (!typePay) {
      throw new NotFoundException(`No se encontro el tipo de pago`);
    }
    return typePay;
  }

  async create(data: CreateTypePayDto) {
    const newTypePay = new this.typePayModel(data);
    const typePaySave = await newTypePay.save();
    return typePaySave;
  }

  async update(id: string, changes: UpdateTypePayDto) {
    const typePay = await this.typePayModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!typePay) {
      throw new NotFoundException(`No se encontro el tipo de pago`);
    }
    return typePay;
  }

  async remove(id: string) {
    const typePay = await this.typePayModel.findOne({ _id: id }).exec();
    if (!typePay) {
      throw new NotFoundException(`No se encontro el tipo de producto`);
    }
    const typePayRemove = await this.typePayModel.findByIdAndDelete(id);
    return typePayRemove;
  }
}
