import { CommonRoutesConfig } from '../common/common.routes.config.js';
export class ContactsRoutes extends CommonRoutesConfig {
    constructor(app) {
        super(app, 'ContatsRoutes');
    }
    configureRoutes() {
        this.app.route(`/contacts`).get((_, res) => {
            res.status(200).send(`List of users`);
        });
        return this.app;
    }
}
//# sourceMappingURL=contacts.routes.config.js.map