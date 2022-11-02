import { Nango } from '@nangohq/node-client';

// CLI command to test: 'npm start syncGithubStargazers [api-key]'
// Endpoint documentation: https://docs.github.com/en/rest/activity/starring#list-stargazers
export let syncGithubStargazers = async (api_token: string) => {
    let owner = 'nangohq';
    let repo = 'nango';

    let config = {
        headers: {
            authorization: `Bearer ${api_token}`
        },
        paging_header_link_rel: 'next'
    };

    Nango.sync(`https://api.github.com/repos/${owner}/${repo}/stargazers`, config)
        .then((res) => {
            console.log(res.data);
        })
        .catch((error) => {
            console.log(error);
        });
};
