import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';
import { Street } from './street.schema';

export class Coordinates extends Document {
  @Prop()
  latitude: number;

  @Prop()
  longitude: number;
}

@Schema({
  timestamps: true,
})
export class AddressCompany extends Document {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  reference: string;

  @Prop({ default: null })
  description: string;

  @Prop({ type: Types.ObjectId, ref: Company.name, required: true })
  companyId: Company | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Street.name, required: true })
  streetId: Street | Types.ObjectId;

  @Prop()
  coordinates: Coordinates;

  @Prop({ default: true })
  status: boolean;
}

export const AddressCompanySchema =
  SchemaFactory.createForClass(AddressCompany);
