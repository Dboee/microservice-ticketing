import request from 'supertest';

import { app } from '../../app';

import { Ticket } from '../../models/ticket';

const createTicket = (title: string, price: number) => {
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title,
    price,
  });
};

it('can fetch a list of tickets', async () => {
  await createTicket('Karpe: Amsterdam', 1500);
  await createTicket('Karpe: Oslo', 2000);
  await createTicket('Karpe: Kenya', 30);

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
