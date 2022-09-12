import { HubspotContactsSync } from './integrations/crm/hubspot/sync/contacts.js';
import type { Connection } from '../api/crm/v1/connections/connection.js';
import syncsQueue from './utils/syncs.queue.js';
import connectionService from '../api/crm/v1/connections/connections.service.js';

await syncsQueue.connect();
syncsQueue.consume((connectionId: string) => {
    connectionService.readById(connectionId).then((connection: Connection | null) => {
        if (connection == null) {
            console.log("Unidentified connectionId received from 'syncs' queue.");
            return;
        }

        new HubspotContactsSync(connection).historicalSync();
    });
});
