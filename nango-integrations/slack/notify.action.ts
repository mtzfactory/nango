import {NangoAction} from "../../nango-action";

class SlackNotifyAction extends NangoAction {

    override async executeAction(input: Object) {
        console.log(`SlackNotifyAction has been called with input:\n${JSON.stringify(input)}`);
    }

}