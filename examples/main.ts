import {syncGithubStargazers, syncGithubUserRepos} from './examples-list/github.js'
import {syncHubspotContacts} from './examples-list/hubspot.js'
import {syncPokemonList} from './examples-list/pokemon.js'
import {syncRedditSubredditPosts} from './examples-list/reddit.js'
import {syncSlackMessages} from './examples-list/slack.js'
import {syncTypeformResponses} from './examples-list/typeform.js'
import {syncGoogleCalendarEvents} from './examples-list/google-calendar.js'

let parseArguments = (arg_count: number) => {
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

var function_name;

try {
    function_name = process.argv.slice(2)[0];
} catch (e) {
    console.log("Pass in a function name as argument (from the 'examples-list/*.ts' files), e.g. 'npm run start syncPokemonList'.");
    process.exit(1);
}

if (function_name == null) {
    console.log("Pass in a function name as argument (from the 'examples-list/*.ts' files), e.g. 'npm run start syncPokemonList'.");
    process.exit(1);
}
var args: string[] = [];
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
    case 'syncRedditSubredditPosts':
        args = parseArguments(1);
        syncRedditSubredditPosts(args[0]!).then(logSuccess);
        break;
    case 'syncSlackMessages':
        args = parseArguments(2);
        syncSlackMessages(args[0]!, args[1]!).then(logSuccess);
        break;
    case 'syncTypeformResponses':
        args = parseArguments(2);
        syncTypeformResponses(args[0]!, args[1]!).then(logSuccess);
        break;
    case 'syncGoogleCalendarEvents':
        args = parseArguments(2);
        syncGoogleCalendarEvents(args[0]!, args[1]!).then(logSuccess);
        break;
    default:
        console.log("Unknown function name, please pick a function name from the 'examples-list/*.ts' files.'");
}
