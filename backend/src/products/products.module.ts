import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { Product, ProductSchema } from './product.schema.js';

@Module({
  // Registra el modelo Product para poder usarlo en el servicio
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
