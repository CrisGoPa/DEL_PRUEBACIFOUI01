import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, QueryFilter } from 'mongoose';
import { Product } from './product.schema.js';
import { CATEGORIAS, CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  // Nest nos da el "modelo" de Mongoose: el objeto con el que leemos y escribimos en MongoDB
  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {}

  findAll(buscar?: string, categoria?: string) {
    // Filtro de MongoDB: empieza vacío (= todos) y se añaden condiciones si llegan
    const filtro: QueryFilter<Product> = {};

    if (categoria) {
      if (!CATEGORIAS.includes(categoria)) {
        throw new BadRequestException(`categoria debe ser una de: ${CATEGORIAS.join(', ')}`);
      }
      filtro.categoria = categoria;
    }

    const texto = typeof buscar === 'string' ? buscar.trim() : ''; // por si llega repetido (?buscar=a&buscar=b)
    if (texto) {
      // Escapamos caracteres especiales (. ( * …) para buscarlos como texto normal
      const patron = new RegExp(texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); // 'i' = sin distinguir mayúsculas
      filtro.$or = [{ nombre: patron }, { marca: patron }]; // en el nombre O en la marca
    }

    return this.productModel.find(filtro).sort({ createdAt: 1 }).exec(); // del más antiguo al más nuevo
  }

  async findOne(id: string) {
    // Si el id no tiene formato de id de Mongo, ni lo buscamos
    const producto = isValidObjectId(id) ? await this.productModel.findById(id).exec() : null;
    if (!producto) {
      throw new NotFoundException(`No existe ningún producto con id ${id}`); // responde 404
    }
    return producto;
  }

  create(datos: CreateProductDto) {
    // Los valores por defecto y el recorte de espacios los aplica el esquema
    return this.productModel.create(datos);
  }

  async update(id: string, datos: UpdateProductDto) {
    const producto = isValidObjectId(id)
      ? await this.productModel
          .findByIdAndUpdate(id, datos, { returnDocument: 'after', runValidators: true }) // devuelve el producto ya modificado
          .exec()
      : null;
    if (!producto) {
      throw new NotFoundException(`No existe ningún producto con id ${id}`);
    }
    return producto;
  }

  async remove(id: string) {
    const producto = isValidObjectId(id) ? await this.productModel.findByIdAndDelete(id).exec() : null;
    if (!producto) {
      throw new NotFoundException(`No existe ningún producto con id ${id}`);
    }
  }
}
