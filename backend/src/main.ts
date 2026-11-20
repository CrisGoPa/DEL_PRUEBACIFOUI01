import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS: permite que el frontend abierto con doble clic (file://) llame a la API
  app.enableCors();

  // Sirve la web (carpeta /frontend) en la raíz: http://localhost:3000/ o la URL de Render.
  // Este archivo compilado está en backend/dist/, así que la web está dos carpetas más arriba.
  app.useStaticAssets(join(import.meta.dirname, '..', '..', 'frontend'));

  // Valida los cuerpos de las peticiones con las reglas de los DTO
  // whitelist: descarta campos que no estén en el DTO
  // forbidNonWhitelisted: y además responde 400 si llegan campos desconocidos
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Render indica el puerto en la variable PORT; en local se usa 3000
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
