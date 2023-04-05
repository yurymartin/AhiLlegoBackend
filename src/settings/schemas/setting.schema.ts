import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Setting extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ required: true })
  value: string;

  @Prop({ default: true })
  status: boolean;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
