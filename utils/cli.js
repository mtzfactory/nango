import * as fs from 'fs'
import * as child_process from 'child_process'
import {dirname} from 'path'
import { fileURLToPath } from 'url';


const action = process.argv[2];

// Make sure cwd is always where the JS file resides
const __filename = fileURLToPath(import.meta.url);
process.chdir(dirname(__filename));

switch (action) {

    // Compiles nango-integrations TS files & copies integrations.yaml over
    case 'compile-integrations':
        fs.rmSync('../nango-integrations-compiled', {recursive: true, force: true});
        child_process.execSync(`../node_modules/typescript/bin/tsc ../nango-integrations/**/*.mts --outDir ../nango-integrations-compiled -t es2022 --moduleResolution node `);
        fs.cpSync('../nango-integrations/integrations.yaml', '../nango-integrations-compiled/nango-integrations/integrations.yaml');
}