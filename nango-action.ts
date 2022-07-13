
class NangoAction {

    async httpRequest() {

    }
    
    async executeAction(input: Object) {
        console.log(`Default NangoAction - executeAction has been called. This is probably not what you intended. Passed input:\n${JSON.stringify(input)}`);
        return;
    }
}

export {NangoAction};