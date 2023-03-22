import { EventHubs } from '@delight-system/microservice-common';

import { eventHubWrapper } from './eventhub-wrapper';

// starts the express server
// and connecting to the database.

// Event Hub Client=======================================================================================================
// Producer Variables
const producerConnectionString: string = process.env.PUBLISH_KEY || '';
const producerEventHubName: EventHubs = EventHubs.Tickets;

// Consumer Variables
const consumerConnectionString: string = process.env.LISTEN_KEY || '';
const consumerEventHubName: EventHubs = EventHubs.Orders;
const consumerGroup: 'tickets-listener' = 'tickets-listener';
const storageCredentialString: string = process.env.STORAGE_KEY || '';
const containerName: string = 'eventhub-container';

//DB ==================================================================================================================
import mongoose from 'mongoose';
import { DatabaseConnectionError } from '@delight-system/microservice-common';
import { app, port } from './app';

// Listeners
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

export const ticketCreatedClient = eventHubWrapper.connectProducer(
  producerConnectionString,
  producerEventHubName
);

const start = async () => {
  // Check if JWT_KEY is defined
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  // Check if MONGO_URI is defined
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.PUBLISH_KEY) {
    throw new Error('PUBLISH_KEY must be defined');
  }
  if (!process.env.LISTEN_KEY) {
    throw new Error('LISTEN_KEY must be defined');
  }
  if (!process.env.STORAGE_KEY) {
    throw new Error('STORAGE_KEY must be defined');
  }

  // Start the listeners
  // try {
  //   await new OrderCreatedListener().listen();
  //   await new OrderCancelledListener().listen();
  // } catch (err) {
  //   console.error(err);
  // }

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
