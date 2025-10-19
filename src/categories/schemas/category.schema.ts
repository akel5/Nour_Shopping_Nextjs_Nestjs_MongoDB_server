import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  logoUrl: string; // כאן נשמור את הקישור מהשרת תמונות
}

export const CategorySchema = SchemaFactory.createForClass(Category);