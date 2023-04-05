import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class StatusOrder extends Document {
  @Prop({ required: true, unique: true })
  step: number;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  icon: string;
}

export const StatusOrderSchema = SchemaFactory.createForClass(StatusOrder);
