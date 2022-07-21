import * as fs from 'fs';
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
        case 'prepublish-module':
            const module = process.argv[3];
            const supported_modules = ['cli'];

            if (typeof module !== 'string' || supported_modules.indexOf(module) === -1) {
                throw new Error("Wrong argument for 'publish-module' command. Please provide a module name.");
            }

            switch (module) {
                case 'cli':
                    // Copy main Readme over to appear on the NPM registry.
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
