import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AtGuard } from './common/guards';
import * as cookieParser from 'cookie-parser';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(
    {
      "origin": "http://localhost:3000/",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    }
  );
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalGuards(new AtGuard());
  
  await app.listen(3333);
}
bootstrap();


