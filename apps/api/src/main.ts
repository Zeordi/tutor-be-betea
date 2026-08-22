import "./instrument"; // Must be the first import
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:8081", // Expo
  ],
  credentials: true,
});
  
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Tutor Be Betea API running on http://localhost:${port}`);
}

bootstrap();
