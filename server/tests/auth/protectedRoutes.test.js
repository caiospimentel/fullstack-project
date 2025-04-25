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

describe('GET /protected', () =>{
    it('should allow access with a valid token', async () => {
        const validToken = jwt.sign({ authorized: true }, JWT_SECRET, { expiresIn: '1h' });

        await redisClient.set(validToken, 'valid', { EX: 3600 });

        const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${validToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Hello, authorized user!');
        expect(response.body).toHaveProperty('user');
    });

    it('should deny access with no token', async () => {
        const response = await request(app)
        .get('/protected');

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message');
    });
    it('should deny access with an invalid token', async () => {
        const response = await request(app)
          .get('/protected')
          .set('Authorization', 'Bearer invalidToken');
    
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message');
      });
})