import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductsModule } from './products/products.module.js';

@Module({
  imports: [
    // Conexión a MongoDB local (base de datos "catalogo")
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/catalogo'),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
