// server/src/products/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, index: true }) // 'index: true' מייעל חיפושים
  categoryName: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);