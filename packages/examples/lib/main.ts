import { Nango, NangoSyncConfig } from '@nangohq/node-client';

let config: NangoSyncConfig = {
    response_path: 'results',
    paging_url_path: 'next',
    max_total: 100
};

let res = await Nango.sync('https://pokeapi.co/api/v2/pokemon', config);

console.log(res.data);
