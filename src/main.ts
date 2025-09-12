import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.enableCors({
    origin: [
      'http://localhost:5000',
      'http://localhost:3000',
      'http://85.217.170.47',
      'https://85.217.170.47',
      "http://crm.mindgame.ua",
      "https://crm.mindgame.ua"
    ],
    credentials: true,
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
