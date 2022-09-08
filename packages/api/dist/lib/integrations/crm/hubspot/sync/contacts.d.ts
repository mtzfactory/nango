declare class HubspotContactsSync {
    sync(): Promise<void>;
    getContacts(contactProperties: string[]): Promise<any[]>;
    getContactProperties(): Promise<string[]>;
    contactstoRawObjects(contacts: any[]): {
        raw: any;
        connection_id: number;
        object_type: string;
    }[];
    persistRawObjects(raw_objects: {
        raw: any;
        connection_id: number;
        object_type: string;
    }[]): void;
    enrichWithToken(config: any): any;
}
export { HubspotContactsSync };
