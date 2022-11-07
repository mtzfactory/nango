# Nango examples

This directory contains a collection of examples of things you can build with Nango.

Explore them all by looking at the files in the `examples-list` subfolder or [the examples list in the docs](https://docs.nango.dev/real-world-examples).

## Getting ready to run examples
Before you run examples from this directory install the dependencies:

```bash
git clone https://github.com/NangoHQ/nango.git
cd nango
npm i
```

Then make sure Nango is running:
```bash
docker compose up
```

## Running an example
First make sure you are in the `examples` folder:
```bash
cd examples
```

Take a look at the example file to find the function name of the example you want to run, e.g. `syncGithubStargazers`

You can then run it with
```bash
npm run start syncGithubStargazers
```

Some examples take additional parameters, e.g. `syncRedditSubredditPosts` expects a subreddit to sync posts from. Just append these:
```bash
npm run start syncRedditSubredditPosts redditapi
```

Running into trouble? Reach out to us on the [Slack community](https://nango.dev/slack)