require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');
const { redisClient, connectRedis } = require('../../config/redisClient');

const JWT_SECRET = process.env.JWT_SECRET; 

beforeAll(async () => {
  await connectRedis();
});

afterAll(async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
});

describe('POST /auth/logout', () => {
  it('should logout successfully with a valid token', async () => {
  
    const validToken = jwt.sign({ authorized: true }, JWT_SECRET, { expiresIn: '1h' });
   
    await redisClient.set(validToken, 'valid', { EX: 3600 });
   
    const response = await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Logged out successfully');
  });

  it('should deny access to protected route after logout', async () => {
    const validToken = jwt.sign({ authorized: true }, JWT_SECRET, { expiresIn: '1h' });

    await redisClient.set(validToken, 'valid', { EX: 3600 });

    await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${validToken}`);

    const protectedResponse = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${validToken}`);

    expect(protectedResponse.statusCode).toBe(401);
    expect(protectedResponse.body).toHaveProperty('message');
  });

  it('should deny logout with missing token', async () => {
    const response = await request(app)
      .post('/auth/logout');

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  it('should deny logout with invalid token', async () => {
    const response = await request(app)
      .post('/auth/logout')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message');
  });
});
