import type { Connection } from '../../../shared/models/connection.model.js';
import syncsService from '../../../shared/services/syncs.service.js';
import type { Sync } from '../../../shared/models/sync.model.js';
import service from './contacts.hubspot.service.js';
import type { RawObject } from '../../../shared/models/raw_object.model.js';
import rawObjectsService from '../../../shared/services/raw_objects.service.js';
import contactsService from '../../../shared/services/contacts.service.js';
import contactsMapper from './contacts.hubspot.mapping.js';

class HubspotContactsSync {
    connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async sync() {
        let now = new Date();
        let lastSync: Sync | null = await syncsService.getLastSync(this.connection.id);
        let lastSyncAt: Date | null = lastSync != null ? lastSync.sync_at : null;

        // Fetch all contact properties from Hubspot.
        let contactProperties: string[] = await service.getContactProperties(this.connection);

        // Fetch updated raw contacts from Hubspot.
        let rawContacts: RawObject[] = await service.getContacts(this.connection, contactProperties, lastSyncAt);

        if (rawContacts == null || rawContacts.length == 0) {
            console.log('Nothing to sync.');
        } else {
            // Persist raw contacts.
            let rawContactIds = await rawObjectsService.createFromList(rawContacts);

            // Map and persist standard contacts.
            if (rawContactIds != null && rawContactIds.length === rawContacts.length) {
                let contacts = contactsMapper.map(rawContacts, rawContactIds);
                await contactsService.upsertFromList(contacts);
            }
        }

        // Persist sync information.
        let sync: Sync = {
            connection_id: this.connection.id,
            sync_at: now,
            type: lastSyncAt == null ? 'historical' : 'periodic'
        };
        await syncsService.createSync(sync);
    }
}

export { HubspotContactsSync };
