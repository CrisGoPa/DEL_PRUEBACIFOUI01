import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Product } from './product.schema.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  // Nest nos da el "modelo" de Mongoose: el objeto con el que leemos y escribimos en MongoDB
  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {}

  findAll() {
    return this.productModel.find().sort({ createdAt: 1 }).exec(); // del más antiguo al más nuevo
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
