import request from 'supertest';

import { app } from '../../app';
import mongoose from 'mongoose';

import { Ticket } from '../../models/ticket';
import { cookie } from 'express-validator';

const createTicket = async (title: string, price: number, cookie: string[]) => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price,
    });
  return response;
};

it('returns 404 if provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'Valid title', price: 20 });

  expect(response.status).toEqual(404);
});

it('returns 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).put(`/api/tickets/${id}`).send({}).expect(401);
});

it('returns 401 if user does not own the ticket', async () => {
  const response = await createTicket(
    'Karpe: Amsterdam',
    1500,
    global.signin()
  );
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Karpe: Oslo',
      price: 2500,
    })
    .expect(401);

  expect(response.body.title).toEqual('Karpe: Amsterdam');
  expect(response.body.price).toEqual(1500);
});

it('returns 400 if user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await createTicket('Karpe: Amsterdam', 1500, cookie);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 2000,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Karpe: Oslo',
      price: -10,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();
  const response = await createTicket('Valid title', 20, cookie);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'New title',
      price: 1000,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(ticketResponse.body.title).toEqual('New title');
  expect(ticketResponse.body.price).toEqual(1000);
});

// it('publishes an event', async () => {
//   const cookie = global.signin();
//   const response = await createTicket('Karpe: Amsterdam', 1500);
//   await request(app)
//     .put(`/api/tickets/${response.body.id}`)
//     .set('Cookie', cookie)
//     .send({
//       title: 'Karpe: Oslo',
//       price: 2000,
//     })
//     .expect(200);
//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// });

// it('rejects updates if the ticket is reserved', async () => {
//   const cookie = global.signin();
//   const response = await createTicket('Karpe: Amsterdam', 1500);
//   const ticket = await Ticket.findById(response.body.id);
//   ticket!.set({ orderId: global.generateId() });
//   await ticket!.save();
//   await request(app)
//     .put(`/api/tickets/${response.body.id}`)
//     .set('Cookie', cookie)
//     .send({
//       title: 'Karpe: Oslo',
//       price: 2000,
//     })
//     .expect(400);
// });
