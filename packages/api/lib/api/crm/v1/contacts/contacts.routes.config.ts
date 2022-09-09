import { CommonRoutesConfig } from '../common/common.routes.config.js';
import ContactsController from './contacts.controller.js';
import ContactsMiddleware from './contacts.middleware.js';
import type express from 'express';

export class ContactsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ContactsRoutes');
    }

    configureRoutes() {
        this.app
            .route(`/crm/v1/contacts`)
            .all(ContactsMiddleware.validateAuth)
            .get(ContactsMiddleware.validateConnectionExists, ContactsController.listContacts);

        return this.app;
    }
}
