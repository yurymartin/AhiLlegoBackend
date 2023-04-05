import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';
import { Order } from './order.schema';

@Schema({
  timestamps: true,
})
export class OrderDetail extends Document {
  @Prop({ type: Types.ObjectId, ref: Order.name, required: true })
  orderId: Order | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Product | Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: null })
  comment: string;

  @Prop({ default: true })
  status: boolean;
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
