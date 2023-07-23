import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Promotion } from '../../schemas/promotion.schema';
import { CreatePromotionDto } from '../../dtos/promotion.dto';
import { Order } from '../../schemas/order.schema';
import {
  PROMOTION_TYPE_FIRST_DELIVERY_FREE,
  STATUS_ORDER_FINALIZED_ID,
  STATUS_ORDER_ON_ROUTE_ID,
  STATUS_ORDER_PENDING_ID,
  STATUS_ORDER_PROCESSING_ID,
} from '../../../common/constants';

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel(Promotion.name)
    private readonly promotionModel: Model<Promotion>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  async getAll(): Promise<Promotion[]> {
    const promotions = await this.promotionModel.find({
      status: true,
    });
    return promotions;
  }

  async getCurrent(): Promise<Promotion> {
    const promotion = await this.promotionModel.findOne({
      status: true,
    });
    return promotion;
  }

  async getCurrentByUserId(userId: string): Promise<Promotion | null> {
    const promotion = await this.promotionModel.findOne({
      status: true,
    });
    if (!promotion) {
      return null;
    }
    const promotionTypeId = Number(promotion.typeId);
    if (promotionTypeId === PROMOTION_TYPE_FIRST_DELIVERY_FREE) {
      const orders = await this.orderModel.findOne({
        userId: new Types.ObjectId(userId),
        $or: [
          { statusOrderId: new Types.ObjectId(STATUS_ORDER_PENDING_ID) },
          { statusOrderId: new Types.ObjectId(STATUS_ORDER_PROCESSING_ID) },
          { statusOrderId: new Types.ObjectId(STATUS_ORDER_ON_ROUTE_ID) },
          { statusOrderId: new Types.ObjectId(STATUS_ORDER_FINALIZED_ID) },
        ],
      });
      if (orders) {
        return null;
      }
      return promotion;
    }
    return promotion;
  }

  async create(data: CreatePromotionDto): Promise<Promotion> {
    const newPromotion = new this.promotionModel(data);
    const promotionSave = await newPromotion.save();
    if (!promotionSave) {
      throw new InternalServerErrorException('Error al registrar la promoción');
    }
    return promotionSave;
  }
}
