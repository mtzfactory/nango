import { NangoAction } from '@nangohq/action';

class SlackNotifyAction extends NangoAction {
    // override async executeAction(input: any) {
    override async executeAction(input: any) {
        console.log(input);
    }
}

export { SlackNotifyAction };
