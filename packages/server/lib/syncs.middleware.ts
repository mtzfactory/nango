import type express from 'express';

class SyncsMiddleware {
    async validateCreateSyncRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        let url = req.body['url'];
        let method = req.body['method'];

        if (url == null) {
            res.status(404).send({
                error: `Missing or wrong 'url' parameter.`
            });
            return;
        }

        if (method != null && !['get', 'post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
            res.status(404).send({
                error: `Invalid 'method' parameter. It shoud be 'get', 'post', 'put', 'patch' or 'delete' (default is 'get').`
            });
            return;
        }

        next();
    }
}

export default new SyncsMiddleware();
