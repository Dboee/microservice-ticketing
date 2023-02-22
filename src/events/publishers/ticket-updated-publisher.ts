import {
  Publisher,
  ConsumerGroups,
  EventHubs,
  ITicketUpdatedEvent,
} from '@delight-system/microservice-common';

// 1. Create a class that extends the Publisher class
export class TicketUpdatedPublisher extends Publisher<ITicketUpdatedEvent> {
  //   Azure specific properties
  eventHubName: EventHubs;
  // 2. Set the consumer group to be used to read messages from the event hub
  readonly consumerGroup: ConsumerGroups.TicketUpdated =
    ConsumerGroups.TicketUpdated;

  // 3. Create a constructor
  constructor() {
    // Azure specific properties
    // 4. Set the event hub name
    const eventHubName: EventHubs = EventHubs.Tickets;
    // 5. Set the consumer group
    const consumerGroup = ConsumerGroups.TicketUpdated;

    // 6. Call the constructor of the Publisher, passing in the eventHubName and consumerGroup
    super(eventHubName, consumerGroup);

    this.eventHubName = eventHubName;
  }
}
