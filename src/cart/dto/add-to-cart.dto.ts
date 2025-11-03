// server/src/cart/dto/add-to-cart.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  productId: string;
}