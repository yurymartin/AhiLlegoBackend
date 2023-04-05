import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDetailDto } from 'src/orders/dtos/orderDetail.dto';
import { OrderDetail } from '../../schemas/orderDetail.schema';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectModel(OrderDetail.name)
    private readonly orderDetailModel: Model<OrderDetail>,
  ) {}

  async findByOrderId(orderId: string) {
    let details = await this.orderDetailModel
      .find({ orderId: orderId })
      .populate('productId', '-createdAt -updatedAt -__v')
      .select('-createdAt -updatedAt -__v')
      .exec();
    return details;
  }

  async create(data: CreateOrderDetailDto) {
    const newOrderDetail = new this.orderDetailModel(data);
    const orderDetailSave = await newOrderDetail.save();
    if (!orderDetailSave) {
      throw new InternalServerErrorException(
        'Error al registrar el detalle de la orden',
      );
    }
    return orderDetailSave;
  }
}
