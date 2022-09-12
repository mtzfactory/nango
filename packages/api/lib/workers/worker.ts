import { HubspotContactsSync } from './crm/hubspot/contacts.hubspot.sync.js';
import type { Connection } from '../shared/models/connection.model.js';
import syncsQueue from './common/syncs.queue.js';
import connectionService from '../shared/services/connections.service.js';

await syncsQueue.connect();

syncsQueue.consume((connectionId: number) => {
    connectionService.readById(connectionId).then((connection: Connection | null) => {
        if (connection == null) {
            console.log("Unidentified connectionId received from 'syncs' queue.");
            return;
        }

        new HubspotContactsSync(connection).sync();
    });
});
