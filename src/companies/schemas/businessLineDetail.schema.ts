import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BusinessLine } from './businessLine.schema';

@Schema({
  timestamps: true,
})
export class BusinessLineDetail extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ type: Types.ObjectId, ref: BusinessLine.name, required: true })
  businessLineId: BusinessLine | Types.ObjectId;
}

export const BusinessLineDetailSchema =
  SchemaFactory.createForClass(BusinessLineDetail);
