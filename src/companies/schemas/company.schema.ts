import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { BusinessLineDetail } from './businessLineDetail.schema';

export class Schedule extends Document {
  @Prop()
  startTime: string;

  @Prop()
  endTime: string;
}

@Schema({
  timestamps: true,
})
export class Company extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ default: 5 })
  commission: string;

  @Prop({ required: true })
  ruc: string;

  @Prop({ required: true })
  logo: string;

  @Prop()
  image: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: null })
  contract: string;

  @Prop({ default: [] })
  openDays: [number];

  @Prop({ default: { startTime: null, endTime: null } })
  schedule: Schedule;

  @Prop({ type: Types.ObjectId, ref: BusinessLineDetail.name, required: true })
  businessLineDetailId: BusinessLineDetail | Types.ObjectId;

  @Prop()
  isOpen: boolean;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: User | Types.ObjectId;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
