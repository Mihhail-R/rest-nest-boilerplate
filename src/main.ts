import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const secret = process.env.COOKIE_SECRET || 'secret';
  app.use(
    session({
      secret,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
      },
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
