import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

//typeId
//1 => primer pedido delivery gratis
//2 => cantidad
//2 => porcentaje

@Schema({
  timestamps: true,
})
export class Promotion extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ default: null })
  description: string;

  @Prop({ default: 1 })
  typeId?: number;

  @Prop({ default: 0 })
  value?: number;

  @Prop({ default: false })
  status?: boolean;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
