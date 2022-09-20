import { PostHog } from 'posthog-node';

class Analytics {
    client: PostHog | undefined;

    constructor() {
        let apiKey = process.env['POSTHOG_API_KEY'];

        if (apiKey == null) {
            console.error('Missing analytics API key.');
        } else {
            this.client = new PostHog(process.env['POSTHOG_API_KEY'] || '', { host: 'https://app.posthog.com' });
        }
    }

    public log(name: string, projectId: number) {
        if (this.client == null) {
            return;
        }

        let event: any = {
            event: name,
            distinctId: `${projectId}`
        };

        this.client.capture(event);
    }
}

export default new Analytics();
