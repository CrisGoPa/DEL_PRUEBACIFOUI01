import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CATEGORIAS } from './dto/create-product.dto.js';

// Esquema del producto en MongoDB (colección "products")
@Schema({
  timestamps: true, // añade createdAt y updatedAt automáticamente
  toJSON: {
    versionKey: false, // no enviar el campo interno __v
    // Mongo guarda el id como "_id"; lo devolvemos como "id" para que el frontend no cambie
    transform: (_doc, ret: Record<string, unknown>) => {
      const { _id, ...resto } = ret;
      return { id: String(_id), ...resto };
    },
  },
})
export class Product {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, trim: true })
  marca: string;

  @Prop({ enum: CATEGORIAS, default: 'otro' })
  categoria: string;

  @Prop({ required: true, min: 0 })
  precio: number;

  @Prop({ min: 0, default: 0 })
  stock: number;

  @Prop({ trim: true, default: '' })
  descripcion: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
