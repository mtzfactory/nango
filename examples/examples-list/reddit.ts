import { Nango } from '@nangohq/node-client';

// CLI command: npm start syncRedditSubredditPosts [subreddit]
// Endpoint docs: https://www.reddit.com/dev/api/#GET_new
export let syncRedditSubredditPosts = async (subreddit: string) => {
    let config = {
        response_path: 'data.children',
        paging_cursor_object_response_path: 'data.name',
        paging_cursor_request_path: 'after',
        max_total: 100,                                     // Limit the total number of posts (for testing).
        frequency: 1                                        // Job frequency in minutes.
    };

    return new Nango().sync(`https://www.reddit.com/r/${subreddit}/new.json`, config);
};
