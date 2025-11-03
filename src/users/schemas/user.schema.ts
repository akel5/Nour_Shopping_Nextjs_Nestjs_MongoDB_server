// server/src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type UserDocument = User & Document;

// הגדרת התפקידים האפשריים
export enum Role {
  User = 'user',
  SubAdmin = 'subadmin',
  Admin = 'admin',
}

@Schema({ _id: false }) // _id: false מונע מ-Mongo ליצור ID ייחודי לכל פריט בעגלה
export class CartItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true, min: 1, default: 1 })
  quantity: number;
}
export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true }) // מוסיף אוטומטית תאריך יצירה ועדכון
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.User })
  role: Role;

  @Prop({ type: [CartItemSchema], default: [] })
  cart: CartItem[];
}

export const UserSchema = SchemaFactory.createForClass(User);

