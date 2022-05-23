import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();// for front-end requests
  await app.listen(4444);
}
bootstrap();
