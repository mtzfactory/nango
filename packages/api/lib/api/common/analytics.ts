import * as Amplitude from '@amplitude/node';

class Analytics {
    client;

    constructor() {
        this.client = Amplitude.init(process.env['AMPLITUDE_API_KEY'] || '');
    }

    public log(name: string, properties?: any) {
        this.client.logEvent({
            event_type: name,
            event_properties: properties
        });
    }
}

export default new Analytics();
