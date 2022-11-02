import { Nango } from '@nangohq/node-client';

// CLI command to test: 'npm start syncPokemonList'
// Endpoint documentation: https://pokeapi.co/docs/v2#pokemon-section
export let syncPokemonList = async () => {
    let config = {
        response_path: 'results',
        paging_url_path: 'next',
        max_total: 100
    };

    return Nango.sync('https://pokeapi.co/api/v2/pokemon', config);
};
