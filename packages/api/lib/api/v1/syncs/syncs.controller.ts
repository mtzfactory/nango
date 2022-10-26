import type express from 'express';
import type { Sync } from '../../../shared/models/sync.model.js';
import syncsService from '../../../shared/services/syncs.service.js';

class SyncsController {
    async createSync(req: express.Request, res: express.Response) {
        let params: Sync = {
            url: req.body['url'],
            method: req.body['method'].toLowerCase(),
            headers: req.body['headers'],
            body: req.body['body'],
            unique_key: req.body['unique_key'],
            response_path: req.body['response_path'],
            paging_request_path: req['paging_request_path'],
            paging_response_path: req['paging_response_path']
        };

        let result = syncsService.createSync(params);

        res.status(200).send({ result: result });
    }
}

export default new SyncsController();
