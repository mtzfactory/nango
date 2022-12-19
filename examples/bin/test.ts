import { Nango } from '@nangohq/node-client';

// node bin/test.js upsertHardDelete
function upsertHardDelete() {
    new Nango().sync('http://localhost:3003/test', {
        friendly_name: 'Test Sync',
        response_path: 'results',
        unique_key: 'unique_key',
        frequency: '1 minute',
        mapped_table: 'test',
        metadata: { metafield: 'metavalue' }
    });
}

// node bin/test.js upsertSoftDelete
function upsertSoftDelete() {
    new Nango().sync('http://localhost:3003/test', {
        friendly_name: 'Test Sync',
        response_path: 'results',
        unique_key: 'unique_key',
        frequency: '1 minute',
        mapped_table: 'test',
        metadata: { metafield: 'metavalue' },
        soft_delete: true
    });
}

// node bin/test.js upsertHardDelete
function overwriteHardDelete() {
    new Nango().sync('http://localhost:3003/test', {
        friendly_name: 'Test Sync',
        response_path: 'results',
        frequency: '1 minute',
        mapped_table: 'test',
        metadata: { metafield: 'metavalue' }
    });
}

// node bin/test.js upsertSoftDelete
function overwriteSoftDelete() {
    new Nango().sync('http://localhost:3003/test', {
        friendly_name: 'Test Sync',
        response_path: 'results',
        frequency: '1 minute',
        mapped_table: 'test',
        metadata: { metafield: 'metavalue' },
        soft_delete: true
    });
}

var function_name: string | undefined;

try {
    function_name = process.argv.slice(2)[0];
} catch (e) {
    console.log("Pass in a function name as argument, e.g. 'npm run start upsertHardDelete'.");
    process.exit(1);
}

switch (function_name) {
    case 'upsertHardDelete':
        upsertHardDelete();
        break;
    case 'upsertSoftDelete':
        upsertSoftDelete();
        break;
    case 'overwriteHardDelete':
        overwriteHardDelete();
        break;
    case 'overwriteSoftDelete':
        overwriteSoftDelete();
        break;
    default:
        console.log("Unknown function name, please pick a function name from the 'bin/test.js'.");
}
