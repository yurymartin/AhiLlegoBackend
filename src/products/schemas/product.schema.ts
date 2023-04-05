import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';
import { TypeProduct } from './typeProduct.schema';

@Schema({
  timestamps: true,
})
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ default: null })
  image: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ type: Types.ObjectId, ref: Company.name, required: true })
  companyId: Company | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: TypeProduct.name, required: true })
  typeProductId: TypeProduct | Types.ObjectId;

  @Prop({ default: true })
  status: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
