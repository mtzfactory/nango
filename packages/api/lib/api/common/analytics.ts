import Amplitude from '@amplitude/node';

class Analytics {
    client;

    constructor() {
        this.client = Amplitude.init(process.env['AMPLITUDE_API_KEY'] || '');
    }

    public log(name: string, properties?: any) {
        let event: any = {
            event_type: name,
            user_id: 'unknown user' // necessary
        };

        if (properties != null) {
            event.event_properties = properties;
        }

        this.client.logEvent(event);
    }
}

export default new Analytics();
