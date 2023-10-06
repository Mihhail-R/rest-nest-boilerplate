import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const secret = configService.get('SESSION_COOKIE_SECRET') || 'secret';
  app.use(
    session({
      secret,
      resave: false,
      cookie: {
        secure: 'auto',
        httpOnly: true,
        maxAge: configService.get('SESSION_COOKIE_MAX_AGE') || 1000 * 60 * 60, // 1 hour
      },
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get('APP_PORT') || 3000);
}
bootstrap();
