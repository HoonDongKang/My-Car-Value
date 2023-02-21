import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication Systme', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'adfadf@hello.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'hello' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  //cookie는 test에서 저장이 되지 않음
  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'hello@hello.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'hello' })
      .expect(201);

    const cookie = res.get('Set-Cookie'); // cookie 가져오기

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
