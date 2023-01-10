import { syncFairingQuestions } from './examples-list/fairing.js';
import { syncGithubStargazers, syncGithubUserRepos } from './examples-list/github.js';
import { syncHubspotContacts } from './examples-list/hubspot.js';
import { syncHubspotContactsWithAuth } from './examples-list/hubspot+oauth.js';
import { syncPokemonList } from './examples-list/pokemon.js';
import { syncRedditSubredditPosts } from './examples-list/reddit.js';
import { syncSlackMessages } from './examples-list/slack.js';
import { syncTypeformResponses } from './examples-list/typeform.js';
import { syncGoogleCalendarEvents } from './examples-list/gcal+oauth.js';
import { syncGmailEmails } from './examples-list/gmail+oauth.js';

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
    console.log(res.data['message']);
};

var function_name;

try {
    function_name = process.argv.slice(2)[0];
} catch (e) {
    console.log("Pass in a function name as argument (from the 'examples-list/*.ts' files), e.g. 'npm run example syncPokemonList'.");
    process.exit(1);
}

if (function_name == null) {
    console.log("Pass in a function name as argument (from the 'examples-list/*.ts' files), e.g. 'npm run example syncPokemonList'.");
    process.exit(1);
}

var args: string[] = [];
switch (function_name) {
    case 'syncFairingQuestions':
        await syncFairingQuestions(parseArguments(1)[0]!).then(logSuccess);
        break;
    case 'syncGithubStargazers':
        args = parseArguments(2);
        await syncGithubStargazers(args[0]!, args[1]!).then(logSuccess);
        break;
    case 'syncGithubUserRepos':
        args = parseArguments(2);
        await syncGithubUserRepos(args[0]!, args[1]!).then(logSuccess);
        break;
    case 'syncHubspotContacts':
        await syncHubspotContacts(parseArguments(1)[0]!).then(logSuccess);
        break;
    case 'syncHubspotContactsWithAuth':
        args = parseArguments(2);
        await syncHubspotContactsWithAuth(args[0]!, args[1]!).then(logSuccess);
        break;
    case 'syncPokemonList':
        await syncPokemonList().then(logSuccess);
        break;
    case 'syncRedditSubredditPosts':
        args = parseArguments(1);
        await syncRedditSubredditPosts(args[0]!).then(logSuccess);
        break;
    case 'syncSlackMessages':
        args = parseArguments(2);
        await syncSlackMessages(args[0]!, args[1]!).then(logSuccess);
        break;
    case 'syncTypeformResponses':
        args = parseArguments(2);
        await syncTypeformResponses(args[0]!, args[1]!).then(logSuccess);
        break;
    case 'syncGmailEmails':
        args = parseArguments(3);
        await syncGmailEmails(args[0]!, args[1]!, args[2]!).then(logSuccess);
        break;
    case 'syncGoogleCalendarEvents':
        args = parseArguments(3);
        await syncGoogleCalendarEvents(args[0]!, args[1]!, args[2]!).then(logSuccess);
        break;
    default:
        console.log("Unknown function name, please pick a function name from the 'examples-list/*.ts' files.'");
}
