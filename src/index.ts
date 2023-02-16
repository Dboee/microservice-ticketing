// starts the express server
// and connecting to the database.

//DB
import mongoose from 'mongoose';

import { DatabaseConnectionError } from '@delight-system/microservice-common';

import { app, port } from './app';

const start = async () => {
  // Check if JWT_KEY is defined
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  // Check if MONGO_URI is defined
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  // DB
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
    throw new DatabaseConnectionError();
  }

  app.listen(port, () => {
    console.log('Listening on port:', port);
  });
};

start();
