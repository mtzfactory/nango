import type express from 'express';
import type { Sync } from '../../../shared/models/sync.model.js';
import syncsService from '../../../shared/services/syncs.service.js';
import syncsQueue from '../../../shared/queues/syncs.queue.js';

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

        let result = await syncsService.createSync(params);

        if (Array.isArray(result) && result.length === 1 && result[0] != null && 'id' in result[0]) {
            let syncId = result[0]['id'];
            syncsQueue.publish(syncId);
            res.status(200).send({ sync_id: syncId });
        } else {
            res.status(500).send({
                error: `There was an unknown error creating your sync.`
            });
        }
    }
}

export default new SyncsController();
