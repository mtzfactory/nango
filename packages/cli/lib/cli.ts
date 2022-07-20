import * as fs from 'fs';
import * as child_process from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const action = process.argv[2];

// Make sure cwd is always where the JS file resides
const __filename = fileURLToPath(import.meta.url);
process.chdir(dirname(__filename));

try {
    runCli(action);
} catch (e) {
    console.log(e);
    console.log(`\n❌ Failed to run CLI command \'${action}\'.\n`);
}

function runCli(action?: string) {
    switch (action) {
        // Compiles nango-integrations TS files & copies integrations.yaml over
        case 'compile-integrations':
            fs.rmSync('../../../nango-integrations-compiled', {
                recursive: true,
                force: true
            });
            child_process.execSync(
                `../../../node_modules/typescript/bin/tsc ../../../nango-integrations/**/*.ts --outDir ../../../nango-integrations-compiled --rootDir ../../.. -t es2022 --moduleResolution node `
            );
            fs.cpSync('../../../nango-integrations/integrations.yaml', '../../../nango-integrations-compiled/nango-integrations/integrations.yaml');
            fs.cpSync('../../../nango-integrations/nango-config.yaml', '../../../nango-integrations-compiled/nango-integrations/nango-config.yaml');
            fs.cpSync('../../../nango-integrations/package.json', '../../../nango-integrations-compiled/nango-integrations/package.json');

            console.log('\n✅ Successfully compiled integrations!\n');
            break;
        case 'prepublish-module':
            const module = process.argv[3];
            const supported_modules = ['cli'];

            if (typeof module !== 'string' || supported_modules.indexOf(module) === -1) {
                throw new Error("Wrong argument for 'publish-module' command. Please provide a module name.");
            }

            switch (module) {
                case 'cli':
                    fs.cpSync('../../../Readme.md', '../../../packages/cli/Readme.md');
                    console.log("\n✅ Successfully prepared module 'cli' for publishing!\n");
                    break;
                default:
                    throw new Error('Unknown module, provided module should one of the following: cli.');
            }
            break;
        default:
            throw new Error('Command not found.');
    }
}
