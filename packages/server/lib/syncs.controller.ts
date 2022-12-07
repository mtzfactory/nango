import type express from 'express';
import type { Sync } from '@nangohq/core';
import { syncsService } from '@nangohq/core';
import syncsClient from './syncs.client.js';

class SyncsController {
    async createSync(req: express.Request, res: express.Response) {
        let syncParams: Sync = {
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
            mapped_table: req.body['mapped_table'],
            frequency: req.body['frequency'] == null || req.body['frequency'] < 1 ? 60 : req.body['frequency'], // Default to hourly Sync jobs, min frequency is 1 minute.
            pizzly_connection_id: req.body['pizzly_connection_id'],
            pizzly_provider_config_key: req.body['pizzly_provider_config_key'],
            max_total: req.body['max_total'],
            friendly_name: req.body['friendly_name'],
            metadata: req.body['metadata']
        };

        let result = await syncsService.createSync(syncParams);

        if (Array.isArray(result) && result.length === 1 && result[0] != null && 'id' in result[0]) {
            let syncId = result[0]['id'];
            syncParams.id = syncId;
            syncsClient.run(syncParams, syncParams.frequency);

            let message = `\n\n✅ Sync ${syncId} created!\n\nSync jobs will execute at the frequency you specified (default: hourly).\n\nVerify that your Sync works (or debug it) by:\n    1. going to your DB (default GUI: http://localhost:8080/?pgsql=nango-db&username=nango&db=nango&ns=nango with password 'nango')\n        - the synced data should be in the destination table you specified in the Sync config (default: '_nango_sync_[SYNC_ID]')\n        - the latest Sync job should have status=succeeeded in the table '_nango_jobs'\n    2. checking the logs with command 'docker-compose logs --follow'\n\n`;

            res.status(200).send({ sync_id: syncId, message: message });
        } else {
            res.status(500).send({
                error: `There was an unknown error creating your sync.`
            });
        }
    }
}

export default new SyncsController();
