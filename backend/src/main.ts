import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: permite que el frontend (abierto desde otro origen) llame a la API
  app.enableCors();

  // Valida los cuerpos de las peticiones con las reglas de los DTO
  // whitelist: descarta campos que no estén en el DTO
  // forbidNonWhitelisted: y además responde 400 si llegan campos desconocidos
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
