import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class DistanceAmount extends Document {
  @Prop({ required: true })
  minDistance: number;

  @Prop({ required: true })
  maxDistance: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: true })
  status: boolean;
}

export const DistanceAmountSchema =
  SchemaFactory.createForClass(DistanceAmount);
