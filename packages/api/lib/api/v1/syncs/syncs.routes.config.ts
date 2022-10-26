import { CommonRoutesConfig } from '../common/common.routes.config.js';
import SyncsController from './syncs.controller.js';
import SyncsMiddleware from './syncs.middleware.js';
import type express from 'express';

export class SyncsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'SyncsRoutes');
    }

    configureRoutes() {
        this.app.route(`/v1/syncs`).post(SyncsMiddleware.validateCreateSyncRequest, SyncsController.createSync);

        return this.app;
    }
}
