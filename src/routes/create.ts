import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
} from '@delight-system/microservice-common';

import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
  '/api/tickets',
  // Middleware to check if user is logged in
  requireAuth,
  // Middleware to validate the request
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  // Middleware to throw an error if the request fails validation
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      // req.currentUser is set by the middleware requireAuth
      userId: req.currentUser!.id,
    });
    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
