import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as session from 'express-session';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(
      session({
        secret: 'secret',
        resave: false,
        cookie: {
          maxAge: 1000 * 60 * 60, // 1 hour
        },
      }),
    );
    await app.init();
  });

  it('/auth/register', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@test.test',
        password: 'test',
        name: 'Test',
      })
      .expect(201);
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@test.test',
        password: 'test',
      })
      .expect(201);
  });
});
