import "./instrument"; // Must be the first import
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Enable all origins in development (supports GitHub Codespaces and local dev)
  app.enableCors({
    origin: true,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  });
  
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Tutor Be Betea API running on http://localhost:${port}`);
}

bootstrap();