import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DocumentType } from './documentType.shema';
import { Profile } from './profile.schema';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ default: null, type: Types.ObjectId, ref: DocumentType.name })
  documentTypeId: DocumentType | Types.ObjectId;

  @Prop({ default: null })
  documentNumber: number;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  surname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: null })
  password: string;

  @Prop({ type: Types.ObjectId, ref: Profile.name, required: true })
  profileId: Profile | Types.ObjectId;

  @Prop({ default: 0 })
  credit: number;

  @Prop({ default: true })
  status: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
