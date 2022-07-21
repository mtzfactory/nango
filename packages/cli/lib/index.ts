#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const program = new Command();

program.name('nango').description('A CLI tool to interact with Nango.');

program
    .command('init')
    .description('Initialize a new project.')
    .action(() => {
        initCommand();
    });

program.parse();

function initCommand() {
    console.log('Welcome to Nango! The open-source infrastructure for native integrations.');

    // Copy the 'nango-integrations' folder at the current path.
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    fs.cpSync(`${__dirname}/../nango-integrations`, './nango-integrations', { recursive: true });
}
