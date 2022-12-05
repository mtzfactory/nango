import { Nango } from '@nangohq/node-client';

// CLI command: npm start syncPokemonList
// Endpoint docs: https://pokeapi.co/docs/v2#pokemon-section
export let syncPokemonList = async () => {
    let config = {
        friendly_name: 'Pokemon List', // Give this Sync a name for prettier logs.
        response_path: 'results',      // For finding records in the API response.
        paging_url_path: 'next',       // For finding pagination data in responses.
        unique_key: 'name',            // Provide response field path for deduping records.
        frequency: 1,                  // How often sync jobs run, in minutes.
        mapped_table: 'pokemons'       // Customize the name of the destination DB table (default: _nango_sync_[sync-id]).
    };

    return new Nango().sync('https://pokeapi.co/api/v2/pokemon', config);
};
