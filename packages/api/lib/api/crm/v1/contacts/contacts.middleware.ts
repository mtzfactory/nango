import type express from 'express';
import connectionService from '../../../../shared/services/connections.service.js';
import analytics from '../../../common/analytics.js';
import projectService from '../../../../shared/services/projects.service.js';

class ContactsMiddleware {
    async validateAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
        let authHeaderValue = req.headers['authorization'];

        if (!authHeaderValue?.startsWith('Bearer ' || authHeaderValue.length !== 36 + 7)) {
            res.status(401).send({
                error: `Unauthorized (authorization header value should be 'Bearer <uuid v4>')`
            });
        } else {
            let token = authHeaderValue.substring(7);
            let project = await projectService.readByToken(token);

            if (project != null) {
                analytics.log('Customer API request', { project_id: project.id });
                next();
            } else {
                res.status(401).send({
                    error: `Unauthorized.`
                });
            }
        }
    }

    async validateConnectionExists(req: express.Request, res: express.Response, next: express.NextFunction) {
        let connectionId = req.headers['x-connection-id'];

        if (connectionId == null || Array.isArray(connectionId)) {
            res.status(404).send({
                error: `Bad or missing 'X-Connection-Id' header.`
            });
            return;
        }

        let connection = await connectionService.readByAccountId(connectionId);

        if (connection !== null) {
            next();
        } else {
            res.status(404).send({
                error: `Could not identify the connection ID.`
            });
        }
    }
}

export default new ContactsMiddleware();
