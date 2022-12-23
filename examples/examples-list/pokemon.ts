import { Nango } from '@nangohq/node-client';

// Test from the 'nango' folder root with command: npm run example syncPokemonList
// Endpoint docs: https://pokeapi.co/docs/v2#pokemon-section
export let syncPokemonList = async () => {
    let config = {
        friendly_name: 'Pokemon List', // Give this Sync a name for prettier logs.
        mapped_table: 'pokemons', // Name of the destination SQL table.
        response_path: 'results', // For finding records in the API response.
        paging_url_path: 'next', // For finding pagination data in responses.
        unique_key: 'name', // Provide response field path for deduping records.
        frequency: '1 minute' // How often sync jobs run in natural language.
    };

    return new Nango().sync('https://pokeapi.co/api/v2/pokemon', config);
};
