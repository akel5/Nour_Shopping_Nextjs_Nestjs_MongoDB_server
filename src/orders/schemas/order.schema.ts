// server/src/orders/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/user.schema'; // נייבא את טיפוס המשתמש

export type OrderDocument = Order & Document;

// הגדרת סוגי התשלום
export enum PaymentMethod {
  CASH = 'cash_on_delivery',
  CARD = 'credit_card',
}

// הגדרת סטטוס הזמנה
export enum OrderStatus {
  PENDING = 'Pending',
  SHIPPED = 'Shipped',
  COMPLETED = 'Completed',
}

// סכמה לפרטי לקוח (מוטבע)
@Schema({ _id: false })
class CustomerDetails {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;
}
const CustomerDetailsSchema = SchemaFactory.createForClass(CustomerDetails);

// סכמה לפריט בודד בהזמנה (מוטבע)
@Schema({ _id: false })
class OrderItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;
}
const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

// הסכמה הראשית של ההזמנה
@Schema({ timestamps: true })
export class Order {
  // קישור למשתמש שיצר את ההזמנה
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ type: CustomerDetailsSchema, required: true })
  customerDetails: CustomerDetails;

  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;
}

export const OrderSchema = SchemaFactory.createForClass(Order);