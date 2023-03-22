import {
  EventHubProducerClient,
  EventHubConsumerClient,
  EventData,
} from '@azure/event-hubs';
import { ContainerClient } from '@azure/storage-blob';
import { BlobCheckpointStore } from '@azure/eventhubs-checkpointstore-blob';
import { ConsumerGroups, EventHubs } from '@delight-system/microservice-common';

class EventHubWrapper {
  // Outputs
  private _eventHubProducerClient?: EventHubProducerClient;
  private _eventHubConsumerClient?: EventHubConsumerClient;

  // // Constructor Generated Variables
  // private containerClient?: ContainerClient;
  // private checkpointStore?: BlobCheckpointStore;

  get producerClient(): EventHubProducerClient {
    if (!this._eventHubProducerClient) {
      throw new Error('EventHub Producer client not initialized');
    }

    return this._eventHubProducerClient;
  }

  get consumerClient(): EventHubConsumerClient {
    if (!this._eventHubConsumerClient) {
      throw new Error('EventHub Consumer client not initialized');
    }
    return this._eventHubConsumerClient;
  }

  connectProducer(
    producerConnectionString: string,
    producerEventHubName: EventHubs
  ) {
    // Producer Client Setup
    if (producerConnectionString)
      throw new Error('Producer connection string not set');
    if (producerEventHubName)
      throw new Error('Producer event hub name not set');
    this._eventHubProducerClient = new EventHubProducerClient(
      producerConnectionString,
      producerEventHubName
    );
    return this._eventHubProducerClient;
  }

  connectConsumer(
    consumerConnectionString: string,
    consumerEventHubName: EventHubs,
    consumerGroup: ConsumerGroups,
    storageCredentialString: string,
    containerName: string
  ) {
    // Storage Container Client Setup (consumer)
    if (!storageCredentialString)
      throw new Error('Storage credential string not set');
    if (!containerName) throw new Error('Container name not set');
    const containerClient = new ContainerClient(
      storageCredentialString,
      containerName
    );

    // Checkpoint Store Setup (consumer)
    const checkpointStore = new BlobCheckpointStore(containerClient);

    // Consumer Client Setup
    if (!consumerConnectionString)
      throw new Error('Consumer connection string not set');
    if (!consumerEventHubName)
      throw new Error('Consumer event hub name not set');
    if (!consumerGroup) throw new Error('Consumer group not set');
    if (!checkpointStore) throw new Error('Checkpoint store not set');
    this._eventHubConsumerClient = new EventHubConsumerClient(
      consumerGroup,
      consumerConnectionString,
      consumerEventHubName,
      checkpointStore
    );
    return this._eventHubConsumerClient;
  }
}

export const eventHubWrapper = new EventHubWrapper();
