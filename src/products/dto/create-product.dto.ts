// server/src/products/dto/create-product.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'הקישור לתמונה אינו תקין' })
  imageUrl: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  categoryName: string;
}