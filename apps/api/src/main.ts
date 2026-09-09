import "./instrument";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

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