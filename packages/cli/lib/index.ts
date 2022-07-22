#!/usr/bin/env node

/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import { Command } from 'commander';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as child_process from 'child_process';

const program = new Command();

program.name('nango').description('A CLI tool to interact with Nango.');

program
    .command('init')
    .description('Initialize a new project.')
    .action(() => {
        initCommand();
    });

program
    .command('watch')
    .description('Compile typescript files on save.')
    .action(() => {
        watchCommand();
    });

program.parse();

function initCommand() {
    console.log('Welcome to Nango! The open-source infrastructure for native integrations.');

    // Copy the 'nango-integrations' folder at the current path.
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    fs.cpSync(`${__dirname}/../nango-integrations`, './nango-integrations', { recursive: true });
}

function watchCommand() {
    console.log('\n👀 Compiling on save. Please keep this terminal window open.\n');
    child_process.execSync('./node_modules/typescript/bin/tsc ./**/*.ts --outDir ./dist --rootDir . -t es2022 --moduleResolution node --watch');
}
