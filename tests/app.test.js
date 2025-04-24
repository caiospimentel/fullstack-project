const request = require('supertest');
const app = require('../server/app');

describe('GET /', () => {
  it('should respond with "API Running 🚀"', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('API Running 🚀');
  });
});
