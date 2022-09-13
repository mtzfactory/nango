import type express from 'express';
import connectionService from '../../../../shared/services/connections.service.js';
import analytics from '../../../common/analytics.js';

class ContactsMiddleware {
    async validateAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
        let authHeaderValue = req.headers['authorization'];

        console.log(req.headers);
        if (authHeaderValue === 'Bearer 13e5d090-2eb4-4ae2-ad2d-cf53204245e0') {
            analytics.log('Customer API request');
            next();
        } else if (authHeaderValue === 'Bearer a6697f42-4b96-4138-9b2e-503b586e4b9d') {
            next();
        } else {
            res.status(401).send({
                error: `Unauthorized.`
            });
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
