// server/src/cart/cart.module.ts
import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule, // כדי שנוכל להשתמש ב-JwtAuthGuard
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // מאפשר ל-Service לגשת למודל 'User'
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}