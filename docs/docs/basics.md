---
sidebar_position: 2
sidebar_label: API Basics
---

# API Basics

Base URL: `https://api.nango.dev/v1/`

## Authentication
You authenticate your app with your API key which you pass in as a Bearer token in the `Authorization` header in every request:
```
Authorization: Bearer <your-api-key>
```

:::tip Keep your api key secret!
Your api key is a secret which authorizes requests from your app: Keep it secret and do not include it anywhere where it could be publicly visible (such as javascript code in your frontend).
:::


To authenticate the end-user for whom you want to fetch details you need to also set the `X-User-Account` header and pass in the user token which you got from us:
```
X-User-Account: <user-token>
```
Check the [User authentication](user-authentication.md) section to see how you can obtain this from your frontend


All requests must be made over HTTPS.

## Rate limits
The Nango API employs a simple rate limit of 100 requests per second per user token. There is no limit per api key.

Because we import and cache the raw data from the CRM on our side you do not need to worry about the rate limits of the underlying CRM systems. We will import data from there as fast as possible for you.

## API Errors
All objects returned from the API are wrapped in our global JSON response:
```json
{
    "status": "ok",
    "result": // The result of the API request
}
```
Results with status ok return one of the 20X status codes.

If there was an error the global response will indicate so and return additional details that describe the error like this:
```json
{
    "status": "error",
    "error_type": "PARAMS_ERROR",
    "error_msg": "I am a detailed message describing what is wrong and why"
}
```

Currently we return the following error types:
- `PARAMS_ERROR`: There was a problem with the parameters you passed in for the request, status code = 400
- `PROCESSING_ERROR`: There was a problem processing your request, status code = 500
- `AUTH_ERROR`: There was a problem with authorization (e.g missing/invalid api key or user token), status code = 401