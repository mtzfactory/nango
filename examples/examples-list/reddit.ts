import { Nango } from '@nangohq/node-client';

// CLI command: npm start syncRedditSubredditPosts [subreddit]
// Endpoint docs: https://www.reddit.com/dev/api/#GET_new
export let syncRedditSubredditPosts = async (subreddit: string) => {
    let config = {
        response_path: 'data.children',
        paging_cursor_metadata_response_path: 'data.after',
        paging_cursor_request_path: 'data.before',
        max_total: 100
    };

    return Nango.sync(`https://www.reddit.com/r/${subreddit}/new.json`, config);
};
