import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';
import { User } from '../../users/schemas/user.schema';
import { StatusOrder } from './statusOrder.schema';
import { TypePay } from './typePay.schema';
import { Promotion } from './promotion.schema';

export class Coordinates extends Document {
  @Prop()
  latitude: number;

  @Prop()
  longitude: number;
}

@Schema({
  timestamps: true,
})
export class Order extends Document {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  amountProducts: number;

  @Prop({ required: true })
  igv: number;

  @Prop({ required: true })
  delivery: number;

  @Prop({ required: true })
  amountTotal: number;

  @Prop({ required: true })
  comissionApp: number;

  @Prop({ required: true })
  commissionDeliveryMan: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  amountPayEnteprise: number;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  deliveryManId: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: StatusOrder.name, required: true })
  statusOrderId: StatusOrder | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: TypePay.name, required: true })
  typePayId: TypePay | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Company.name, required: true })
  companyId: Company | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Promotion.name, default: null })
  promotionId: Promotion | Types.ObjectId;

  @Prop({ default: null })
  address: string;

  @Prop({ default: null })
  street: string;

  @Prop({ default: null })
  coordinates: Coordinates;

  @Prop({ default: null })
  reference: string;

  @Prop({ required: true })
  date: string;

  @Prop({ default: null })
  dateDelivery: string;

  @Prop({ default: null })
  dateTimeConfirmed: string;

  @Prop({ default: false })
  checkPay: boolean;

  @Prop({ default: false })
  checkDeliveredClient: boolean;

  @Prop({ default: false })
  payDeliveryMan: boolean;

  @Prop({ default: 0 })
  calification: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
