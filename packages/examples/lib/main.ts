import { syncGithubStargazers, syncGithubUserRepos } from './examples/github.js';
import { syncHubspotContacts } from './examples/hubspot.js';
import { syncPokemonList } from './examples/pokemon.js';
import { syncSlackMessages } from './examples/slack.js';

let parseArguments = (arg_count: number): string[] => {
    const args = process.argv.slice(3);

    if (args.length != arg_count) {
        console.log(
            `This example function takes ${arg_count} argument(s) (${args.length} provided). Inspect the example's source code to understand which arguments are required.`
        );
        process.exit(1);
    }

    return args;
};

let logSuccess = (res) => {
    console.log(
        `✅ New Sync was successfully created with ID ${res.data['sync_id']}.\n\n👀 View the synced data at http://localhost:8080/?pgsql=nango-db&username=nango&db=nango&ns=public&select=_nango_raw (password: nango).`
    );
};

var function_name: string | undefined;

try {
    function_name = process.argv.slice(2)[0];
} catch (e) {
    console.log("Pass in a function name as argument (from the 'lib/examples/*.ts' files), e.g. 'npm start sync_pokemon_list'.");
    process.exit(1);
}

if (function_name == null) {
    console.log("Pass in a function name as argument (from the 'lib/examples/*.ts' files), e.g. 'npm start sync_pokemon_list'.");
    process.exit(1);
}

switch (function_name) {
    case 'syncGithubStargazers':
        syncGithubStargazers(parseArguments(1)[0]!).then(logSuccess);
        break;
    case 'syncGithubUserRepos':
        syncGithubUserRepos(parseArguments(1)[0]!).then(logSuccess);
        break;
    case 'syncHubspotContacts':
        syncHubspotContacts(parseArguments(1)[0]!).then(logSuccess);
        break;
    case 'syncPokemonList':
        syncPokemonList().then(logSuccess);
        break;
    case 'syncSlackMessages':
        let args = parseArguments(2);
        syncSlackMessages(args[0]!, args[1]!).then(logSuccess);
        break;
    default:
        console.log("Unknown function name, please pick a function name from the 'lib/examples/*.ts' files.'");
}
