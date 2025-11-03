import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@UseGuards(JwtAuthGuard) // אבטחה! כל הראוטים כאן דורשים טוקן
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // קבלת העגלה של המשתמש המחובר
  @Get()
  async getCart(@Request() req) {
    // req.user מגיע מה-JwtStrategy אחרי אימות הטוקן
    const userId = req.user.userId;
    return this.cartService.getCart(userId);
  }

  // הוספת פריט לעגלה
  @Post('add')
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    const userId = req.user.userId;
    return this.cartService.addToCart(userId, addToCartDto);
  }

  // עדכון כמות של פריט
  @Patch('update/:productId')
  async updateItemQuantity(
    @Request() req,
    @Param('productId') productId: string,
    @Body() updateDto: UpdateCartItemDto,
  ) {
    const userId = req.user.userId;
    return this.cartService.updateItemQuantity(userId, productId, updateDto);
  }

  // הסרת פריט מהעגלה
  @Delete('remove/:productId')
  async removeFromCart(@Request() req, @Param('productId') productId: string) {
    const userId = req.user.userId;
    return this.cartService.removeFromCart(userId, productId);
  }

  // ניקוי כל העגלה
  @Delete('clear')
  async clearCart(@Request() req) {
    const userId = req.user.userId;
    return this.cartService.clearCart(userId);
  }
}