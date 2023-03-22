import {
  Publisher,
  ConsumerGroups,
  EventHubs,
  ITicketCreatedEvent,
  Subjects,
} from '@delight-system/microservice-common';

export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
