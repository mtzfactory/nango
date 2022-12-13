import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Sync Modes

Nango supports the following syncing modes:
- **Full Refresh + Overwrite**: on each job, read all the objects from the API, overwrite by first deleting existing rows
- **Full Refresh + Upsert**: on each job, read all the objects from the API, append new rows & update existing rows (see below)
- **Incremental + Upsert** (coming soon): on each job, only read the new/updated objects from the API, append new rows & update existing rows

The **Full Refresh + Overwrite** mode is used by default. To use the **Full Refresh + Upsert** mode, provide a right value for the `unique_key` field in the [Sync config options](sync-all-options.md), the value of which will be used to dedupe rows.

You can view your Sync configurations in the SQL table `_nango_syncs` and your Sync jobs in `_nango_jobs` (both are in the `nango` schema).