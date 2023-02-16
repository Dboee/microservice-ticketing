import request from 'supertest';
import { app } from '../../app';

import { Ticket } from '../../models/ticket';

describe('Ticket backend service', () => {
  it('is listening to /api/tickets for post requests', async () => {
    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    await request(app).post('/api/tickets').send({}).expect(401);
  });
  it('returns a status other than 401 if user is signed in', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({});
    expect(response.status).not.toEqual(401);
  });

  // it('can fetch a list of tickets', async () => {});

  // it('can fetch a single ticket', async () => {
  //   // Test code here
  // });

  // it('can update an existing ticket', async () => {
  //   // Test code here
  // });

  // it('can delete an existing ticket', async () => {
  //   // Test code here
  // });

  describe('parameter validation', () => {
    it('Title validation', async () => {
      await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
          title: '',
          price: 10,
        })
        .expect(400);

      await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
          price: 10,
        })
        .expect(400);
    });

    it('Price validation', async () => {
      await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
          title: 'Valid Title',
          price: -10,
        })
        .expect(400);

      await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
          title: 'Valid Title',
        })
        .expect(400);
    });

    it('creates a new ticket with valid paramaters', async () => {
      // Add in a check to make sure a ticket was saved in DB
      let tickets = await Ticket.find({});
      expect(tickets.length).toEqual(0);

      await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
          title: 'Karpe: Spektrum',
          price: 1600,
        })
        .expect(201);

      tickets = await Ticket.find({});
      expect(tickets.length).toEqual(1);

      expect(tickets[0].title).toEqual('Karpe: Spektrum');
      expect(tickets[0].price).toEqual(1600);
    });
  });

  // describe('Error handling', () => {
  //   it('handles errors when creating ticket', async () => {
  //     // Test code here
  //   });
  //   it('handles errors when updating a ticket', async () => {
  //     // Test code here
  //   });
  //   it('handles errors when deleting a ticket', async () => {
  //     // Test code here
  //   });
  // });

  // describe('Concurrency', () => {
  //   it('handles concurrent requests to create, update, or delete tickets', async () => {
  //     // Test code here
  //   });
  // });
});
