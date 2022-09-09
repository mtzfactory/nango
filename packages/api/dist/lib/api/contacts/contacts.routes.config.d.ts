import { CommonRoutesConfig } from '../common/common.routes.config.js';
import type express from 'express';
export declare class ContactsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application);
    configureRoutes(): express.Application;
}
