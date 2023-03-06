import {
  Listener,
  ConsumerGroups,
  EventHubs,
  IOrderCancelledEvent,
} from '@delight-system/microservice-common';

import { PartitionContext, ReceivedEventData } from '@azure/event-hubs';

import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<IOrderCancelledEvent> {
  readonly eventHubName: EventHubs.Orders = EventHubs.Orders;
  readonly consumerGroup: ConsumerGroups.OrderCancelled =
    ConsumerGroups.OrderCancelled;
  constructor() {
    super(EventHubs.Orders, ConsumerGroups.OrderCancelled);
  }

  async onMessage(
    data: IOrderCancelledEvent['data'],
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

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: undefined });
    // Save the ticket
    await ticket.save();

    // Publish an event saying that a ticket was updated
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
