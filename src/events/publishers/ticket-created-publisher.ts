import {
  Publisher,
  ConsumerGroups,
  EventHubs,
  ITicketCreatedEvent,
} from '@delight-system/microservice-common';

export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
  //   Azure specific properties
  readonly eventHubName: EventHubs.Tickets = EventHubs.Tickets;
  readonly consumerGroup = ConsumerGroups.TicketCreated;

  constructor() {
    // Azure specific properties

    // Calls constructor of Listener, passing in the eventHubName and consumerGroup
    super(EventHubs.Tickets, ConsumerGroups.TicketCreated);
  }
}
