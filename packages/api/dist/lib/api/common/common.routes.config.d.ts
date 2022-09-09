import type express from 'express';
export declare abstract class CommonRoutesConfig {
    app: express.Application;
    name: string;
    constructor(app: express.Application, name: string);
    getName(): string;
    abstract configureRoutes(): express.Application;
}
