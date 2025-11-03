// server/src/orders/orders.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/schemas/user.schema';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './schemas/order.schema';

@UseGuards(JwtAuthGuard) // אבטחה! כל הראוטים כאן דורשים טוקן
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * POST /orders
   * יצירת הזמנה חדשה (לכל משתמש מחובר)
   */
  @Post()
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.userId;
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  /**
   * GET /orders/my
   * שליפת כל ההזמנות של המשתמש המחובר
   */
  @Get('my')
  async findUserOrders(@Request() req) {
    const userId = req.user.userId;
    return this.ordersService.findUserOrders(userId);
  }

  // --- נקודות קצה לאדמין בלבד ---

  /**
   * GET /orders
   * שליפת כל ההזמנות במערכת (אדמין בלבד)
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  /**
   * PATCH /orders/:id/status
   * עדכון סטטוס הזמנה (אדמין בלבד)
   */
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateOrderStatus(orderId, status);
  }
}