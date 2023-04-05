import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BusinessLine } from '../../schemas/businessLine.schema';
import {
  CreateBusinessLineDto,
  UpdateBusinessLineDto,
} from '../../dtos/businessLine.dto';

@Injectable()
export class BusinessLineService {
  constructor(
    @InjectModel(BusinessLine.name)
    private readonly businessLineModel: Model<BusinessLine>,
  ) {}

  async findAll() {
    const businessLines = await this.businessLineModel
      .find()
      .select('-createdAt -updatedAt -__v')
      .exec();
    return businessLines;
  }

  async findOne(id: string) {
    const businessLine = await this.businessLineModel
      .findOne({ _id: id })
      .select('-createdAt -updatedAt -__v')
      .exec();
    if (!businessLine) {
      throw new NotFoundException(`No se encontro el giro de negocío`);
    }
    return businessLine;
  }

  async create(data: CreateBusinessLineDto) {
    const newBusinessLine = new this.businessLineModel(data);
    const businessLineSave = await newBusinessLine.save();
    return businessLineSave;
  }

  async update(id: string, changes: UpdateBusinessLineDto) {
    const businessLine = await this.businessLineModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!businessLine) {
      throw new NotFoundException(`No se encontro el giro de negocío`);
    }
    return businessLine;
  }

  async remove(id: string) {
    const businessLine = await this.businessLineModel
      .findOne({ _id: id })
      .exec();
    if (!businessLine) {
      throw new NotFoundException(`No se encontro el tipo de producto`);
    }
    const businessLineRemove = await this.businessLineModel.findByIdAndDelete(
      id,
    );
    return businessLineRemove;
  }
}
