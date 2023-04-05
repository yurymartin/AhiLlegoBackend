import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Street } from './street.schema';

@Schema({
  timestamps: true,
})
export class StreetAmount extends Document {
  @Prop({ type: Types.ObjectId, ref: Street.name, required: true })
  streetOriginId: Street | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Street.name, required: true })
  streetDestinationId: Street | Types.ObjectId;

  @Prop({ required: true })
  amount: string;

  @Prop({ default: true })
  status: boolean;
}

export const StreetAmountSchema = SchemaFactory.createForClass(StreetAmount);
