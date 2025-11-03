// server/src/cart/dto/update-cart-item.dto.ts
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}