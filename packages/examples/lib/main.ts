import { syncPokemonList } from './examples/pokemon.js';
import { syncHubspotContacts } from './examples/hubspot.js';

let parseArguments = (arg_count: number, function_name: string): string[] => {
    const args = process.argv.slice(3);

    if (args.length != arg_count) {
        console.log(
            `This example function takes ${arg_count} argument(s) (${args.length} provided). Inspect the ${function_name} function source code to understand which arguments are required.`
        );
        process.exit(1);
    }

    return args;
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
    case 'syncPokemonList':
        syncPokemonList();
        break;
    case 'syncHubspotContacts':
        let args = parseArguments(1, function_name);
        syncHubspotContacts(args[0]!);
        break;
    default:
        console.log("Unknown function name, please pick a function name from the 'lib/examples/*.ts' files.'");
}
