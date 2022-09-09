import { CommonRoutesConfig } from '../common/common.routes.config.js';
import type express from 'express';

export class ContactsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ContatsRoutes');
    }

    configureRoutes() {
        this.app.route(`/contacts`).get((_: express.Request, res: express.Response) => {
            res.status(200).send(`List of users`);
        });

        return this.app;
    }
}
