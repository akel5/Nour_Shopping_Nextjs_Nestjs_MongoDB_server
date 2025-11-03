// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // הוסף את השורה הבאה עם מחרוזת החיבור שלך
    MongooseModule.forRoot('mongodb+srv://nourhadi12_db_user:Nourhadi2012%40@nourshoppingdb.hjkogyq.mongodb.net/?retryWrites=true&w=majority&appName=nourshoppingdb'),
    CategoriesModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    CartModule,
    OrdersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}