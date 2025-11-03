// server/src/orders/orders.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { User, UserDocument, CartItem } from 'src/users/schemas/user.schema';
// ProductDocument כבר לא נחוץ כאן
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * יצירת הזמנה חדשה (מעודכן)
   */
  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    
    // 1. קבלת הנתונים מה-DTO
    const { customerDetails, paymentMethod, cart } = createOrderDto;

    // 2. מצא את המשתמש (עדיין נחוץ כדי לקשר את ההזמנה)
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // 3. הבדיקה עכשיו קורית על העגלה שהגיעה מהקליינט
    if (!cart || cart.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // 4. חישוב סכום כולל ויצירת פריטי הזמנה
    // אנחנו סומכים על המחירים והשמות שהקליינט שולח
    // (במערכת מאובטחת יותר, היינו שולפים מחירים מה-DB לפי ID)
    let totalAmount = 0;
    const orderItems = cart.map((cartItem) => {
      totalAmount += cartItem.price * cartItem.quantity;
      return {
        productId: cartItem._id,
        name: cartItem.name,
        price: cartItem.price,
        quantity: cartItem.quantity,
      };
    });

    // 5. יצירת מסמך ההזמנה החדש
    const newOrder = new this.orderModel({
      userId: user._id,
      items: orderItems,
      totalAmount: totalAmount,
      status: OrderStatus.PENDING,
      customerDetails: customerDetails,
      paymentMethod: paymentMethod,
    });

    // 6. שמירת ההזמנה
    // (אנחנו כבר לא צריכים לנקות את 'user.cart' כי הוא לא היה בשימוש)
    return newOrder.save();
  }

  // ... (שאר הפונקציות: findAllOrders, findUserOrders, updateOrderStatus נשארות זהות)
  async findAllOrders(): Promise<Order[]> {
    return this.orderModel.find().populate('userId', 'email').sort({ createdAt: -1 }).exec();
  }
  async findUserOrders(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId: userId }).sort({ createdAt: -1 }).exec();
  }
  async updateOrderStatus( orderId: string, status: OrderStatus, ): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true },
    );
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}