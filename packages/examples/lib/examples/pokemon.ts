import { Nango } from '@nangohq/node-client';

export let syncPokemonList = async () => {
    let config = {
        response_path: 'results',
        paging_url_path: 'next',
        max_total: 100
    };

    Nango.sync('https://pokeapi.co/api/v2/pokemon', config)
        .then((res) => {
            console.log(res.data);
        })
        .catch((error) => {
            console.log(error);
        });
};
