import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class BusinessLine extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ default: true })
  status: boolean;
}

export const BusinessLineSchema = SchemaFactory.createForClass(BusinessLine);
