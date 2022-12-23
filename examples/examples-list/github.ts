import { Nango } from '@nangohq/node-client';

// Test from the 'nango' folder root with command: npm run example syncGithubStargazers [OWNER] [REPO]
// Endpoint documentation: https://docs.github.com/en/rest/activity/starring#list-stargazers
export let syncGithubStargazers = async (owner: string, repo: string) => {
    let config = {
        friendly_name: 'Github Stargazers', // Give this Sync a name for prettier logs.
        mapped_table: 'github_stargazers', // Name of the destination SQL table
        metadata: {
            // Metadata that will get attached to every synced row
            github_org: owner, // The GitHub org
            github_repo: repo // The repo name
        },
        unique_key: 'id', // The key of the unique id in the records, for upserts
        headers: {
            // HTTP headers to be sent with every API request
            Accept: 'application/vnd.github+json' // GitHub recommends passing this for every API request
        },
        paging_header_link_rel: 'next', // For pagination.
        max_total: 100, // For fetching limited records while testing.
        frequency: '1 minute' // How often sync jobs run in natural language.
    };

    return new Nango().sync(`https://api.github.com/repos/${owner}/${repo}/stargazers`, config);
};

// Test from the 'nango' folder root with command: npm run example syncGithubUserRepos [USERNAME] [API-TOKEN]
// Endpoint docs: https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user
export let syncGithubUserRepos = async (username: string, apiToken: string) => {
    let config = {
        friendly_name: 'Github User Repos', // Give this Sync a name for prettier logs.
        mapped_table: 'github_userrepos', // Name of the destination SQL table
        headers: { authorization: `Bearer ${apiToken}` }, // For auth.
        paging_header_link_rel: 'next', // For pagination.
        max_total: 100, // For fetching limited records while testing.
        frequency: '1 minute' // How often sync jobs run in natural language.
    };

    return new Nango().sync(`https://api.github.com/users/${username}/repos?per_page=10`, config);
};
