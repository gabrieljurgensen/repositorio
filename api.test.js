const request = require('supertest');
const app = require('./app'); 

test('Deve responder na rota / com status 200', async () => {
  const res = await request(app).get('/');
  expect(res.statusCode).toBe(200);
});


