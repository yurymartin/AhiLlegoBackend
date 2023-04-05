import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { StatusOrder } from '../../schemas/statusOrder.schema';
import {
  CreateStatusOrderDto,
  UpdateStatusOrderDto,
} from '../../dtos/statusOrder.dto';

@Injectable()
export class StatusOrderService {
  constructor(
    @InjectModel(StatusOrder.name)
    private readonly statusOrderModel: Model<StatusOrder>,
  ) {}

  async findAll() {
    const statusOrders = await this.statusOrderModel
      .find()
      .select('-createdAt -updatedAt -__v')
      .exec();
    return statusOrders;
  }

  async findByStep(step: string | number) {
    const statusOrders = await this.statusOrderModel
      .findOne({ step: step })
      .exec();
    if (!statusOrders) {
      throw new NotFoundException(`No se encontro el estado de pedido`);
    }
    return statusOrders;
  }

  async findOne(id: string) {
    const statusOrder = await this.statusOrderModel
      .findOne({ _id: id })
      .select('-createdAt -updatedAt -__v')
      .exec();
    if (!statusOrder) {
      throw new NotFoundException(`No se encontro el estado de pedido`);
    }
    return statusOrder;
  }

  async create(data: CreateStatusOrderDto) {
    const newStatusOrder = new this.statusOrderModel(data);
    const statusOrderSave = await newStatusOrder.save();
    if (!statusOrderSave) {
      throw new InternalServerErrorException(
        'Error al guardar el estado de la order',
      );
    }
    return statusOrderSave;
  }

  async update(id: string, changes: UpdateStatusOrderDto) {
    const statusOrder = await this.statusOrderModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!statusOrder) {
      throw new NotFoundException(`No se encontro el estado de pedido`);
    }
    return statusOrder;
  }

  async remove(id: string) {
    const statusOrder = await this.statusOrderModel.findOne({ _id: id }).exec();
    if (!statusOrder) {
      throw new NotFoundException(`No se encontro el estado de pedido`);
    }
    const statusOrderRemove = await this.statusOrderModel.findByIdAndDelete(id);
    return statusOrderRemove;
  }
}
