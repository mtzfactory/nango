import { PostHog } from 'posthog-node';
import { v4 as uuidv4 } from 'uuid';

class Analytics {
    client: PostHog | undefined;
    distinctId: string;
    id = 'umhdRwJLNjgUGyU}]|s<]F:Wq\\8{JX5<:^fiySJiXZO>W';

    constructor() {
        this.distinctId = uuidv4();

        if (process.env['TELEMETRY']?.toLowerCase() === 'true' && process.env['SERVER_RUN_MODE'] === 'DOCKERIZED') {
            this.client = new PostHog(this.caesar(this.id, -5), { host: 'https://app.posthog.com' });
        }
    }

    public track(name: string, properties?: Record<string | number, any>) {
        if (this.client == null) {
            return;
        }

        let event: any = {
            event: name,
            distinctId: `${this.distinctId}`,
            properties: properties
        };

        this.client.capture(event);
    }

    public urlToRootHost(url: string | undefined): string {
        if (url == null) {
            return '';
        }

        try {
            let reg = new RegExp('[^.]+(.[^.]{2,4})?.[^.]{2,4}$');
            let matchArr = new URL(url).hostname.match(reg);
            return matchArr != null && matchArr.length > 0 && matchArr[0] != null ? matchArr[0] : '';
        } catch {
            return '';
        }
    }

    caesar(str: string, num: number): string {
        var result = '';
        var charcode = 0;

        for (var i = 0; i < str.length; i++) {
            charcode = str.charCodeAt(i) + num;
            result += String.fromCharCode(charcode);
        }

        return result;
    }
}

export default new Analytics();
