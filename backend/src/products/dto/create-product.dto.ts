import { IsIn, IsInt, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';

// Categorías permitidas (las mismas que el <select> del frontend)
export const CATEGORIAS = ['portátil', 'móvil', 'tablet', 'accesorio', 'otro'];

// Datos que se aceptan al CREAR un producto (POST /products)
export class CreateProductDto {
  @IsString()
  @Matches(/\S/, { message: 'nombre no puede estar vacío' }) // al menos un carácter que no sea espacio
  nombre: string;

  @IsString()
  @Matches(/\S/, { message: 'marca no puede estar vacía' })
  marca: string;

  @IsOptional()
  @IsIn(CATEGORIAS, { message: `categoria debe ser una de: ${CATEGORIAS.join(', ')}` })
  categoria?: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
