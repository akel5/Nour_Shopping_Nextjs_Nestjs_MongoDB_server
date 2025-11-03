// server/src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module'; // 1. נייבא את מודול המשתמשים
import { ProductsModule } from 'src/products/products.module'; // 2. נייבא את מודול המוצרים
import { User, UserSchema } from 'src/users/schemas/user.schema'; // 3. נייבא את סכמת המשתמש
import { Product, ProductSchema } from 'src/products/schemas/products.schema'; // 4. נייבא את סכמת המוצר

@Module({
  imports: [
    AuthModule,
    UsersModule, // 5. נוסיף כדי לגשת ל-UsersService (למרות שכבר לא צריך)
    ProductsModule, // 5. נוסיף כדי לגשת ל-ProductsService
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema }, // 6. נאפשר גישה ישירה למודל 'User'
      { name: Product.name, schema: ProductSchema }, // 7. נאפשר גישה ישירה למודל 'Product'
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}