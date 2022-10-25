import type { Sync } from '../../shared/models/sync.model.js';
import { HttpRequestType } from '../../shared/models/sync.model.js';
import type { AxiosResponse, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import _ from 'lodash';
import type { RawObject } from '../models/raw_object.model.js';

class ExternalService {
    async getRawObjects(sync: Sync): Promise<any[]> {
        let results: any[] = [];
        let done = false;
        let pageCursor = null;
        let maxNumberOfRecords = 2;
        sync.body = sync.body || {};

        while (!done) {
            if (pageCursor != null && sync.paging_request_path != null) {
                sync.body[sync.paging_request_path] = pageCursor;
            }

            let config: AxiosRequestConfig = { headers: sync.headers || {} };
            var res: AxiosResponse<any, any> | void;
            let errorBlock = (err: any) => {
                console.log(err.resposnse.data.message);
            };

            switch (sync.request_type) {
                case HttpRequestType.Get: {
                    res = await axios.get(sync.url, config).catch(errorBlock);
                    break;
                }
                case HttpRequestType.Post: {
                    res = await axios.post(sync.url, sync.body, config).catch(errorBlock);
                    break;
                }
                case HttpRequestType.Put: {
                    res = await axios.put(sync.url, sync.body, config).catch(errorBlock);
                    break;
                }
                case HttpRequestType.Patch: {
                    res = await axios.patch(sync.url, sync.body, config).catch(errorBlock);
                    break;
                }
                case HttpRequestType.Delete: {
                    res = await axios.delete(sync.url, config).catch(errorBlock);
                    break;
                }
            }

            if (res == null) {
                break;
            }

            results = results.concat(res.data.results);

            if (sync.paging_result_path != null && _.get(res.data, sync.paging_result_path) && results.length < maxNumberOfRecords) {
                pageCursor = _.get(res.data, sync.paging_result_path);
            } else {
                done = true;
            }
        }

        let rawObjs: RawObject[] = [];

        for (var rawObj of results) {
            rawObjs.push({
                data: rawObj,
                emitted_at: new Date()
            });
        }

        return rawObjs;
    }
}

export default new ExternalService();
