import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Street } from './street.schema';
import { TypeAddress } from './typeAddress.schema';

export class Coordinates extends Document {
  @Prop()
  accuracy: number;

  @Prop()
  altitude: number;

  @Prop()
  heading: number;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  speed: number;
}

@Schema({
  timestamps: true,
})
export class Address extends Document {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  reference: string;

  @Prop({ default: null })
  description: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: TypeAddress.name, required: true })
  typeAddressId: TypeAddress | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Street.name, required: true })
  streetId: Street | Types.ObjectId;

  @Prop()
  coordinates: Coordinates;

  @Prop({ default: false })
  status: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
