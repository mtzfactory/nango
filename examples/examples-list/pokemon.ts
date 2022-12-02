import { Nango } from '@nangohq/node-client';

// CLI command: npm start syncPokemonList
// Endpoint docs: https://pokeapi.co/docs/v2#pokemon-section
export let syncPokemonList = async () => {
    let config = {
        friendly_name: 'Pokemon List', // For pretty logs.
        response_path: 'results',      // For finding records in the API response.
        paging_url_path: 'next',       // For finding pagination data in responses.
        unique_key: 'name',            // For deduping records.
        frequency: 1                   // How often syncs job runs, in minutes.
    };

    return new Nango().sync('https://pokeapi.co/api/v2/pokemon', config);
};
