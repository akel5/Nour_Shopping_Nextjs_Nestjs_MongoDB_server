// server/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 1. ייבוא
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 2. הגדרה גלובלית
    MongooseModule.forRootAsync({ // 3. טעינה אסינכרונית של ה-DB
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        uri: process.env.DATABASE_URL, // 4. קריאה ממשתנה סביבה
      }),
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    CartModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}