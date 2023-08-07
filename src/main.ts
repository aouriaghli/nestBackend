import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Tenemos que habilitar CORS.. sacado del pdf de nestjs
  app.enableCors();
  
  //Hacemos que el backend sea super restringido.. si el body que viene no es igual a nuestra entidad lo bloquea
  app.useGlobalPipes( 
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
   );

  const PORT = process.env.PORT ?? 3000;
  console.log(`APP corriendo en puerto: ${ PORT }`) ;

  await app.listen( process.env.PORT ?? 3000);
}
bootstrap();
