// server/src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/products.schema'
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // יצירת מוצר חדש
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  // קבלת כל המוצרים לפי קטגוריה
  async findAllByCategory(categoryName: string): Promise<Product[]> {
    return this.productModel.find({ categoryName }).exec();
  }

  // קבלת כל המוצרים (לעמוד הקולקציה)
  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  // עדכון מוצר
  async update(id: string, updateProductDto: CreateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true }, // החזר את המסמך המעודכן
    );
    if (!updatedProduct) {
      throw new NotFoundException('מוצר לא נמצא');
    }
    return updatedProduct;
  }

  // מחיקת מוצר
  async delete(id: string): Promise<{ message: string }> {
    const result = await this.productModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('מוצר לא נמצא');
    }
    return { message: 'המוצר נמחק בהצלחה' };
  }
}