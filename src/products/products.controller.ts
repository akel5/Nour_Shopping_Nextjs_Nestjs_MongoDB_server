// server/src/products/products.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/schemas/user.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // --- נקודות קצה מאובטחות (רק לאדמין וסאב-אדמין) ---

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SubAdmin) // רק הרשאות אלו יכולות
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SubAdmin)
  update(@Param('id') id: string, @Body() updateProductDto: CreateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SubAdmin) // אפשר להחליט שרק אדמין ראשי מוחק
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  // --- נקודות קצה ציבוריות (כל אחד יכול לראות) ---

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('category/:name')
  findAllByCategory(@Param('name') name: string) {
    // חשוב לפענח את הקידוד מה-URL
    const categoryName = decodeURIComponent(name);
    return this.productsService.findAllByCategory(categoryName);
  }
}