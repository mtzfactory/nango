# Nango examples

This directory contains a collection of examples of things you can build with Nango.

Explore them all by looking at the files in the `examples-list` subfolder or [the examples list in the docs](https://docs.nango.dev/real-world-examples).

## Getting ready to run examples
Before you run examples install the dependencies:

```bash
git clone https://github.com/NangoHQ/nango.git
cd nango
npm i
npm run ts-build
```

Then make sure Nango is running:
```bash
docker compose up
```

## Running an example
First make sure you are at the `nango` folder root.

Take a look at the example file to find the function name of the example you want to run, e.g. `syncGithubStargazers`

You can then run it with the following command (internal-user-id can be any value you want, e.g. the user's id in your app)
```bash
npm run example syncGithubStargazers <owner> <repo> <internal-user-id>
```

Some examples take additional parameters, e.g. `syncRedditSubredditPosts` expects a subreddit to sync posts from. Just append these:
```bash
npm run example syncRedditSubredditPosts redditapi
```

Running into trouble? Reach out to us on the [Slack community](https://nango.dev/slack)
