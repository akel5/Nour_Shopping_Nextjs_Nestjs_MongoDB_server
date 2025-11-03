// server/src/orders/dto/create-order.dto.ts
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsIn,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';

// הגדרת סוגי התשלום
export enum PaymentMethod {
  CASH = 'cash_on_delivery',
  CARD = 'credit_card',
}

// DTO לפריט בודד שהקליינט שולח
class CartItemDto {
  @IsString()
  @IsNotEmpty()
  _id: string; // זהו ה-productId

  @IsNumber()
  @Min(1)
  quantity: number;

  // נוסיף גם את אלה כדי שהשרת לא יצטרך לשלוף אותם
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

// DTO לפרטי הלקוח
export class CustomerDetailsDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

// ה-DTO הראשי
export class CreateOrderDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CustomerDetailsDto)
  customerDetails: CustomerDetailsDto;

  @IsString()
  @IsNotEmpty()
  @IsIn([PaymentMethod.CASH, PaymentMethod.CARD])
  paymentMethod: PaymentMethod;

  // --- השדה החדש ---
  // אנו דורשים מהקליינט לשלוח את העגלה שלו
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  cart: CartItemDto[];
}