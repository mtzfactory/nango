import { Nango } from '@nangohq/node-client';

// CLI command: npm start syncRedditSubredditPosts [subreddit]
// Endpoint docs: https://www.reddit.com/dev/api/#GET_new
export let syncRedditSubredditPosts = async (subreddit: string) => {
    let config = {
        friendly_name: 'Reddit Subreddit Posts',         // Give this Sync a name for prettier logs.
        response_path: 'data.children',                  // For finding records in the API response.
        paging_cursor_object_response_path: 'data.name', // For finding pagination data in responses.
        paging_cursor_request_path: 'after',             // For adding pagination data in requests.
        max_total: 100,                                  // For fetching limited records while testing.
        frequency: 1                                     // How often sync jobs run, in minutes.
    };

    return new Nango().sync(`https://www.reddit.com/r/${subreddit}/new.json`, config);
};
