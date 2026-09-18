import "./instrument";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { validateCriticalSecrets } from "./config/env.validation";
import { Logger } from "@nestjs/common";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import * as express from "express";

async function bootstrap() {
  validateCriticalSecrets();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.enableCors({
    origin: true,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  });

  app.use("/payments/webhook", express.raw({ type: "application/json" }));
  app.use("/escrow/webhook", express.raw({ type: "application/json" }));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  new Logger("Bootstrap").log(`Tutor Be Betea API running on http://localhost:${port}`);
}

bootstrap();
