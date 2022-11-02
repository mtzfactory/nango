import type { Sync } from '@nangohq/core';
import type { AxiosResponse, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import _ from 'lodash';
import type { RawObject } from '../models/raw_object.model.js';
import { logger } from '@nangohq/core';

class ExternalService {
    async getRawObjects(sync: Sync): Promise<any[]> {
        if (sync.id == null) {
            return [];
        }

        var results: any[] = [];
        let done = false;
        let pageCursor = null;
        let maxNumberOfRecords = sync.max_total || 10000;
        sync.body = sync.body || {};

        while (!done) {
            if (pageCursor != null && sync.paging_request_path != null) {
                sync.body[sync.paging_request_path] = pageCursor;
            }

            let config: AxiosRequestConfig = { headers: sync.headers || {} };
            var res: AxiosResponse<any, any> | void;
            let errorBlock = (err: any) => {
                console.log(err);
            };

            switch (sync.method) {
                case 'get': {
                    res = await axios.get(sync.url, config).catch(errorBlock);
                    break;
                }
                case 'post': {
                    res = await axios.post(sync.url, sync.body, config).catch(errorBlock);
                    break;
                }
                case 'put': {
                    res = await axios.put(sync.url, sync.body, config).catch(errorBlock);
                    break;
                }
                case 'patch': {
                    res = await axios.patch(sync.url, sync.body, config).catch(errorBlock);
                    break;
                }
                case 'delete': {
                    res = await axios.delete(sync.url, config).catch(errorBlock);
                    break;
                }
                default: {
                    console.log('Unknown HTTP method.');
                    return [];
                }
            }

            if (res == null) {
                break;
            }

            logger.debug(`External request's data:`);
            logger.debug(res.data);

            logger.debug(`External request's headers:`);
            logger.debug(res.headers);

            let new_results = sync.response_path != null ? _.get(res.data, sync.response_path) : res.data;
            results = results.concat(new_results);

            if (sync.paging_response_path != null && _.get(res.data, sync.paging_response_path) && results.length < maxNumberOfRecords) {
                pageCursor = _.get(res.data, sync.paging_response_path);
            } else if (sync.paging_url_path != null && this.isValidHttpUrl(_.get(res.data, sync.paging_url_path)) && results.length < maxNumberOfRecords) {
                sync.url = _.get(res.data, sync.paging_url_path);
            } else {
                done = true;
            }
        }

        if (results.length > maxNumberOfRecords) {
            results = results.slice(0, maxNumberOfRecords);
        }

        let rawObjs: RawObject[] = [];

        for (var rawObj of results) {
            rawObjs.push({
                sync_id: sync.id,
                data: rawObj,
                emitted_at: new Date()
            });
        }

        return rawObjs;
    }

    isValidHttpUrl(str: string) {
        var pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$',
            'i'
        ); // fragment locator
        return !!pattern.test(str);
    }
}

export default new ExternalService();
