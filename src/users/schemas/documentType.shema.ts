import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class DocumentType extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: true })
  status: boolean;
}

export const DocumentTypeSchema = SchemaFactory.createForClass(DocumentType);
