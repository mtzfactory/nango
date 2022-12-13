import { Nango } from '@nangohq/node-client';

// CLI command: npm start syncGithubStargazers [api-key]
// Endpoint documentation: https://docs.github.com/en/rest/activity/starring#list-stargazers
export let syncGithubStargazers = async (owner: string, repo: string, user_id: string) => {

    let config = {
        friendly_name: 'Github Stargazers',                // Give this Sync a name for prettier logs.
        mapped_table: 'github_stargazers',                 // Name of the destination table
        metadata: {                                        // Metadata that will get attached to every synced row
            user_id: user_id,                              // Our internal user id (or account id etc.)
            github_org: owner,                             // The GitHub org
            github_repo: repo                              // The repo name
        },
        unique_key: 'id',                                   // The key of the unique id in the records, for upserts

        headers: {                                         // HTTP headers to be sent with every API request
            'Accept': 'application/vnd.github+json'                    // GitHub recommends passing this for every API request
        },

        paging_header_link_rel: 'next'                     // For pagination.
    };

    return new Nango().sync(`https://api.github.com/repos/${owner}/${repo}/stargazers`, config);
};

// CLI command: npm start syncGithubUserRepos [api-key]
// Endpoint docs: https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user
export let syncGithubUserRepos = async (api_token: string) => {
    let username = 'bastienbeurier';

    let config = {
        friendly_name: 'Github User Repos',                // Give this Sync a name for prettier logs.
        headers: { authorization: `Bearer ${api_token}` }, // For auth.
        paging_header_link_rel: 'next'                     // For pagination.
    };

    return new Nango().sync(`https://api.github.com/users/${username}/repos?per_page=10`, config);
};
