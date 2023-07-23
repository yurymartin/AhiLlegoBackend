import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class DiscountCode extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  value: number;

  @Prop({ default: null })
  description: string;

  @Prop({ default: null })
  representative: string;

  @Prop({ default: 0 })
  quantityAvailable: number;

  @Prop({ required: true })
  expirationDate: string;

  @Prop({ default: true })
  status: boolean;
}

export const DiscountCodeSchema = SchemaFactory.createForClass(DiscountCode);
