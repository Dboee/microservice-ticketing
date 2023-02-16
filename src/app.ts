// Description: This file is the entry point for the auth service.
// It is responsible for configuring the express server

import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

// Other
import cookieSession from 'cookie-session';

// Middlewares
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@delight-system/microservice-common';

// Routes
import { createTicketRouter } from './routes/create';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

// setup
const port = 3000;
const app = express();

// Trust ingress-nginx. This is required for secure cookies to work in a k8s cluster with ingress-nginx.
app.set('trust proxy', true);

// Body parser. This is required for express to understand incoming JSON payloads.
app.use(json());

// Cookies. This is required for express to understand incoming cookies.
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test' ? true : false,
  })
);
// check if user is logged in
app.use(currentUser);

//routes
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// Middlewares
app.use(errorHandler);

export { app, port };
