// server/src/cart/cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, CartItem } from 'src/users/schemas/user.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // 1. שליפת העגלה של המשתמש
  async getCart(userId: string): Promise<CartItem[]> {
    const user = await this.userModel.findById(userId).select('cart').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.cart;
  }

  // 2. הוספת פריט לעגלה
  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<UserDocument> {
    const { productId } = addToCartDto;
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId === productId,
    );

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    return user.save();
  }

  // 3. עדכון כמות פריט
  async updateItemQuantity(
    userId: string,
    productId: string,
    updateDto: UpdateCartItemDto,
  ): Promise<UserDocument> {
    const { quantity } = updateDto;
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId === productId,
    );

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity = quantity;
      return user.save();
    } else {
      throw new NotFoundException('Item not found in cart');
    }
  }

  // 4. הסרת פריט מהעגלה (עם תיקון)
  async removeFromCart(userId: string, productId: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { cart: { productId: productId } } },
      { new: true },
    );

    if (!user) { // <-- התיקון כאן
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // 5. ניקוי כל העגלה (עם תיקון)
  async clearCart(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { cart: [] } },
      { new: true },
    );

    if (!user) { // <-- התיקון כאן
      throw new NotFoundException('User not found');
    }
    return user;
  }
}