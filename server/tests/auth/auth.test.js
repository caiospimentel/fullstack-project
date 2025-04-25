const request = require('supertest');
const app = require('../../app');
const { redisClient } = require('../../config/redisClient'); // <-- import redisClient


describe('POST /auth/validate', () => {
    it('should return 200 and a token when the keyword is correct', async () =>{
        const response = await request(app)
        .post('/auth/validate')
        .send({ keyword: 'letmein'});

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token')
        expect(typeof response.body.token).toBe('string');
    });

    it('should return 401 when keyword is incorrect', async () => {
        const response = await request(app)
          .post('/auth/validate')
          .send({ keyword: 'wrongpassword' });
    
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid keyword');
      });
}
)

afterAll(async () => {
  if (redisClient.isOpen) {
    await redisClient.quit(); // Properly close Redis
  }
});
