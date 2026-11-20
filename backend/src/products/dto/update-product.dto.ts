import { IsIn, IsInt, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';
import { CATEGORIAS } from './create-product.dto.js';

// Datos que se aceptan al EDITAR (PATCH /products/:id): las mismas reglas, pero todo opcional
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Matches(/\S/, { message: 'nombre no puede estar vacío' })
  nombre?: string;

  @IsOptional()
  @IsString()
  @Matches(/\S/, { message: 'marca no puede estar vacía' })
  marca?: string;

  @IsOptional()
  @IsIn(CATEGORIAS, { message: `categoria debe ser una de: ${CATEGORIAS.join(', ')}` })
  categoria?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
