import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the ticket is not found', async () => {
  const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
  await request(app).get(`/api/tickets/${id.toHexString()}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'Karpe: Amsterdam';
  const price = 8000;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
