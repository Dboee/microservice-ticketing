import {
  Listener,
  IOrderCreatedEvent,
  ConsumerGroups,
  EventHubs,
} from '@delight-system/microservice-common';

import { PartitionContext, ReceivedEventData } from '@azure/event-hubs';

import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
  readonly eventHubName: EventHubs.Orders = EventHubs.Orders;
  readonly consumerGroup: ConsumerGroups.OrderCreated =
    ConsumerGroups.OrderCreated;
  constructor() {
    super(EventHubs.Orders, ConsumerGroups.OrderCreated);
  }

  async onMessage(
    data: IOrderCreatedEvent['data'],
    context: PartitionContext,
    event: ReceivedEventData
  ) {
    console.log(this.consumerGroup, ': ', data);

    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw an error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    // If the ticket is already reserved, throw an error
    if (ticket.orderId) {
      throw new Error('Ticket is already reserved');
    }
    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });
    // Save the ticket
    await ticket.save();

    await new TicketUpdatedPublisher().publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });
  }
}
