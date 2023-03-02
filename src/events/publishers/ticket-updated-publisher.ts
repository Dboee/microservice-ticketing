import {
  Publisher,
  ConsumerGroups,
  EventHubs,
  ITicketUpdatedEvent,
} from '@delight-system/microservice-common';

// 1. Create a class that extends the Publisher class
export class TicketUpdatedPublisher extends Publisher<ITicketUpdatedEvent> {
  readonly eventHubName: EventHubs.Tickets = EventHubs.Tickets;
  readonly consumerGroup: ConsumerGroups.TicketUpdated =
    ConsumerGroups.TicketUpdated;

  constructor() {
    super(EventHubs.Tickets, ConsumerGroups.TicketUpdated);
  }
}
