import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Otp extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  expired: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: true })
  status: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
