import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class DiscountCode extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  value: number;

  @Prop({ default: 'QUANTITY' })
  type: string;

  @Prop({ default: 1 })
  typeUseId: number;

  @Prop({ default: null })
  description: string;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  userId: User | Types.ObjectId;

  @Prop({ default: 0 })
  quantityAvailable: number;

  @Prop({ default: 0 })
  representativePercentage: number;

  @Prop({ required: true })
  expirationDate: string;

  @Prop({ default: true })
  status: boolean;
}

export const DiscountCodeSchema = SchemaFactory.createForClass(DiscountCode);
