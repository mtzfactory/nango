# Storage & Logs 

### Storage

Pizzly stores developer and user credentials in a Postgres database of your choosing, in a Postgres schema called `pizzly`. 

If running the [Getting Started](getting-started.md) with `docker compose up`, Pizzly will automatically generate a new Postgres database for faster experimentation.

You can specify which database Pizzly should use by modifying the environment variables in the `.env` files at the root of the Pizzly folder.

### Logs

When you run Pizzly locally with docker compose you can view the logs in real-time with this command:
```
docker compose logs --follow
```

By default, Pizzly logs info-level messages and above. You can make logs more verbose by setting `LOG_LEVEL` to `debug` (or less verbose by setting it to `error`) in the `.env` file.