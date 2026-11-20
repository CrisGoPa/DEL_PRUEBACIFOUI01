import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

// Forma de un producto guardado
export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
}

@Injectable()
export class ProductsService {
  // "Base de datos" de la Fase 2: un array en memoria (se vacía al reiniciar el servidor)
  private productos: Producto[] = [];

  findAll(): Producto[] {
    return this.productos;
  }

  findOne(id: string): Producto {
    const producto = this.productos.find((p) => p.id === id);
    if (!producto) {
      throw new NotFoundException(`No existe ningún producto con id ${id}`); // responde 404
    }
    return producto;
  }

  create(datos: CreateProductDto): Producto {
    const producto: Producto = {
      id: randomUUID(), // el id lo genera el servidor
      nombre: datos.nombre.trim(),
      marca: datos.marca.trim(),
      categoria: datos.categoria ?? 'otro', // valores por defecto si no llegan
      precio: datos.precio,
      stock: datos.stock ?? 0,
      descripcion: datos.descripcion?.trim() ?? '',
    };
    this.productos.push(producto);
    return producto;
  }

  update(id: string, datos: UpdateProductDto): Producto {
    const producto = this.findOne(id); // lanza 404 si no existe

    // Solo cambiamos los campos que llegan
    if (datos.nombre !== undefined) producto.nombre = datos.nombre.trim();
    if (datos.marca !== undefined) producto.marca = datos.marca.trim();
    if (datos.categoria !== undefined) producto.categoria = datos.categoria;
    if (datos.precio !== undefined) producto.precio = datos.precio;
    if (datos.stock !== undefined) producto.stock = datos.stock;
    if (datos.descripcion !== undefined) producto.descripcion = datos.descripcion.trim();

    return producto;
  }

  remove(id: string): void {
    this.findOne(id); // lanza 404 si no existe
    this.productos = this.productos.filter((p) => p.id !== id);
  }
}
