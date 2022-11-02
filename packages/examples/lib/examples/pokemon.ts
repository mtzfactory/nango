import { Nango } from '@nangohq/node-client';

// CLI command: npm start syncPokemonList
// Endpoint docs: https://pokeapi.co/docs/v2#pokemon-section
export let syncPokemonList = async () => {
    let config = {
        response_path: 'results',
        paging_url_path: 'next',
        max_total: 100
    };

    return Nango.sync('https://pokeapi.co/api/v2/pokemon', config);
};
