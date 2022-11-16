import type express from 'express';
import type { Sync } from '@nangohq/core';
import { syncsService, syncsQueue } from '@nangohq/core';

class SyncsController {
    async createSync(req: express.Request, res: express.Response) {
        let params: Sync = {
            url: req.body['url'],
            method: req.body['method']?.toLowerCase() || 'get',
            headers: req.body['headers'],
            body: req.body['body'],
            query_params: req.body['query_params'],
            unique_key: req.body['unique_key'],
            response_path: req.body['response_path'],
            paging_cursor_request_path: req.body['paging_cursor_request_path'],
            paging_cursor_metadata_response_path: req.body['paging_cursor_metadata_response_path'],
            paging_cursor_object_response_path: req.body['paging_cursor_object_response_path'],
            paging_url_path: req.body['paging_url_path'],
            paging_header_link_rel: req.body['paging_header_link_rel'],
            auto_mapping: req.body['auto_mapping'] || true, // Default to auto mapping enabled.
            frequency: req.body['frequency'] == null || req.body['frequency'] < 1 ? 60 : req.body['frequency'], // Default to hourly Sync jobs, min frequency is 1 minute.
            max_total: req.body['max_total']
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
