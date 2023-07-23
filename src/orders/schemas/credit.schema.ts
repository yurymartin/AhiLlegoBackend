import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { DiscountCode } from './discountCode.schema';

@Schema({
  timestamps: true,
})
export class Credit extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: DiscountCode.name, default: null })
  discountCodeId: DiscountCode | Types.ObjectId;

  @Prop({ default: null })
  description?: string;

  @Prop({ default: true })
  status?: boolean;
}

export const CreditSchema = SchemaFactory.createForClass(Credit);
