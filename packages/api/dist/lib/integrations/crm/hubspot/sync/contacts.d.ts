import type { Knex } from 'knex';
interface RawContact {
    raw: any;
    connection_id: number;
    object_type: string;
}
interface Contact {
    raw_id: number;
    external_id?: string;
    first_name?: string;
    last_name?: string;
    job_title?: string;
    account?: string;
    addresses?: string;
    emails?: string;
    phones?: string;
    last_activity_at?: Date;
    external_created_at?: Date;
    external_modified_at?: Date;
}
declare class HubspotContactsSync {
    sync(): Promise<void>;
    getContacts(contactProperties: string[]): Promise<any[]>;
    getContactProperties(): Promise<string[]>;
    contactstoRawObjects(contacts: any[]): RawContact[];
    persistRawObjects(db: Knex, rawContacts: RawContact[]): Promise<{
        id: number;
    }[] | void>;
    persistContacts(db: Knex, contacts: Contact[]): Promise<void>;
    enrichWithToken(config: any): any;
    mapToStandardContacts(rawContacts: RawContact[], rawContactIds: {
        id: number;
    }[]): Contact[];
}
export { HubspotContactsSync };
