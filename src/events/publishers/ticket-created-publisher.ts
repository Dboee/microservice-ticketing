import {
  Publisher,
  ConsumerGroups,
  EventHubs,
  ITicketCreatedEvent,
} from '@delight-system/microservice-common';

export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
  //   Azure specific properties
  eventHubName: EventHubs;
  readonly consumerGroup = ConsumerGroups.TicketCreated;

  constructor() {
    // Azure specific properties
    const eventHubName: EventHubs = EventHubs.Tickets;
    const consumerGroup = ConsumerGroups.TicketCreated;

    // Calls constructor of Listener, passing in the eventHubName and consumerGroup
    super(eventHubName, consumerGroup);

    // Sets the subject property
    this.eventHubName = eventHubName;
  }
}
