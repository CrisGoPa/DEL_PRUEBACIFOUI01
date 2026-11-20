import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

// Todas las rutas de este controlador empiezan por /products
@Controller('products')
export class ProductsController {
  // Nest nos "inyecta" el servicio, que es quien guarda los datos
  constructor(private readonly productsService: ProductsService) {}

  // GET /products → lista todos
  // Filtros opcionales en la URL: /products?buscar=mac&categoria=portátil
  @Get()
  findAll(@Query('buscar') buscar?: string, @Query('categoria') categoria?: string) {
    return this.productsService.findAll(buscar, categoria);
  }

  // GET /products/:id → uno concreto
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // POST /products → crea (el cuerpo se valida con CreateProductDto)
  @Post()
  create(@Body() datos: CreateProductDto) {
    return this.productsService.create(datos);
  }

  // PATCH /products/:id → edita los campos enviados
  @Patch(':id')
  update(@Param('id') id: string, @Body() datos: UpdateProductDto) {
    return this.productsService.update(id, datos);
  }

  // DELETE /products/:id → borra (responde 204: sin contenido)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id); // esperamos para que un 404 llegue al cliente
  }
}
