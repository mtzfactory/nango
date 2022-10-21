import { CommonRoutesConfig } from '../common/common.routes.config.js';
import SyncsController from './syncs.controller.js';
import type express from 'express';

export class SyncsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'SyncsRoutes');
    }

    configureRoutes() {
        this.app.route(`/v1/syncs`).get(SyncsController.listSyncs);

        return this.app;
    }
}
