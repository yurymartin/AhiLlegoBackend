import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { User } from './user.schema';

@Schema({
  timestamps: true,
})
export class UserSession extends Document {
  @Prop()
  token: string;

  @Prop()
  tokenDevice: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: User | Types.ObjectId;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
