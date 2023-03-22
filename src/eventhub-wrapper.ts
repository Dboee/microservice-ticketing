import { EventHubProducerClient, EventData } from '@azure/event-hubs';

class EventHubWrapper {
  private _eventHubClient?: EventHubProducerClient;

  constructor(connectionString: string, eventHubName: string) {
    this._eventHubClient = EventHubClient.createFromConnectionString(
      connectionString,
      eventHubName
    );
  }

  public async sendEvent(event: EventData): Promise<void> {
    await this._eventHubClient.send(event);
  }

  public async close(): Promise<void> {
    await this._eventHubClient.close();
  }
}
