import supertest from 'supertest';
import app from '../../app';
import { prisma } from '../../libs/prisma';

afterEach(async () => {
  await prisma.user.delete({ where: { email: 'test@gmail.com' } });
});

describe('Auth API', () => {
  const userData = {
    email: 'test@gmail.com',
    password: 'Test@123',
  };

  it('should register a user', async () => {
    const response = await supertest(app)
      .post('/api/auth/register')
      .send(userData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      'message',
      'User created successfully',
    );
  });

  it('should login a user', async () => {
    await supertest(app).post('/api/auth/register').send(userData);
    const response = await supertest(app)
      .post('/api/auth/login')
      .send(userData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'User logged in successfully',
    );
  });

  it('should logout a user', async () => {
    await supertest(app).post('/api/auth/register').send(userData);
    const loginResponse = await supertest(app)
      .post('/api/auth/login')
      .send(userData);

    const response = await supertest(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
      .send({});
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'User logged out successfully',
    );
  });

  it('should get user profile', async () => {
    await supertest(app).post('/api/auth/register').send(userData);
    const loginResponse = await supertest(app)
      .post('/api/auth/login')
      .send(userData);

    const response = await supertest(app)
      .get('/api/auth/get-profile')
      .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'User profile fetched successfully',
    );
  });
});
