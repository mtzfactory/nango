declare class HubspotContactsSync {
    sync(): Promise<void>;
    enrichWithToken(config: any): any;
}
export { HubspotContactsSync };
