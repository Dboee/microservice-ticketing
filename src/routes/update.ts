import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from '@delight-system/microservice-common';

import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';

import { Ticket } from '../models/ticket';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    const backupTicket = ticket;

    if (!ticket) {
      throw new NotFoundError();
    }

    if (!backupTicket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    // Handles publish failures, rolls the updated ticket back to original in the DB if the event fails to publish
    try {
      await new TicketUpdatedPublisher().publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      });
    } catch (err) {
      console.error(err);
      ticket.set({
        title: backupTicket.title,
        price: backupTicket.price,
      });
      await ticket.save();
      console.log(
        'Ticket updated to original values, since the event failed to publish'
      );
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
