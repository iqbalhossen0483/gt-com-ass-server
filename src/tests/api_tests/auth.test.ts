import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../app';
import { connectDB } from '../../config/mongoose';
import User from '../../models/User';

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await User.deleteOne({ number: '01853860385' });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  const userData = {
    databaseId: new mongoose.Types.ObjectId(),
    number: '01853860385',
    password: 'password',
  };

  it('should register a user', async () => {
    const response = await supertest(app)
      .post('/api/auth/register')
      .send(userData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
  });

  it('should login a user', async () => {
    await supertest(app).post('/api/auth/register').send(userData);
    const response = await supertest(app).post('/api/auth/login').send({
      databaseId: userData.databaseId.toHexString(),
      number: userData.number,
      password: userData.password,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should logout a user', async () => {
    await supertest(app).post('/api/auth/register').send(userData);
    const loginResponse = await supertest(app).post('/api/auth/login').send({
      databaseId: userData.databaseId.toHexString(),
      number: userData.number,
      password: userData.password,
    });

    const response = await supertest(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({});
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('should get user profile', async () => {
    await supertest(app).post('/api/auth/register').send(userData);
    const loginResponse = await supertest(app).post('/api/auth/login').send({
      databaseId: userData.databaseId.toHexString(),
      number: userData.number,
      password: userData.password,
    });

    const response = await supertest(app)
      .get('/api/auth/get-profile')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
  });
});
