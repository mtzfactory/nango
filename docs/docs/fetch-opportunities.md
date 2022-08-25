---
sidebar_position: 6
sidebar_label: Fetch Opportunities
---

# Fetch opportunities endpoint

The opportunities api offers the following endpoints:
- [Fetch all opportunities](#fetchOpportunities)
- [Fetch a specific opportunity by id](#fetchOpportunity)

For an example of the `Opportunity` object check the examples below.

## Fetch all opportunities {#fetchOpportunities}

Endpoint: `/crm/opportunities`  
HTTP Method: **GET**  
Headers: API key and user token are mandatory, [see API basics](basics.md)  
Sample call (CURL):
```bash
curl -XGET \
-H 'Authorization: Bearer <api-key>' \
-H 'X-User-Token: <user-token>' \
'https://api.nango.dev/v1/crm/opportunities'
```

#### Query parameters
The following query parameters are available (all are optional):
- **name** (string): If set only opportunities where `name` (the query parameter) appears in the opportunity's `name` property will be returned.
- **include_raw** (boolean): If set to true the response will include the raw original API response of the external system with all fields & data.

Sample response (JSON):
```json
{
    "status": "ok",
    "result": [
        {
            "id": "ccc560e4-6bab-41fd-a0cd-fc94d5152de3",
            "external_id": "3829294",
            "name": "Better Inc New Business",
            "description": "A really great company",
            "stage": "demo",
            "amount": 10000,
            "close_date": "2022-12-12T00:00:00Z",
            "probability": "0.78",
            "expected_revenue": 4000,
            "expected_revenue_currency": "USD",
            "is_won": false,
            "is_closed": false,
            "contacts": [
                "f7db1f94-9087-4ba0-aa7d-3ea96e714771"
            ],
            "accounts": [
                "4688d404-c31e-41ef-8c27-2536cc50ac32"
            ],
            "last_activity_at": "2022-08-12T08:02:29Z",
            "external_created_at": "2022-03-10T19:23:18Z",
            "external_modified_at": "2022-05-07T12:38:28Z",
            "raw_external_data": {
                // Raw response with all data as delivered by the external system.
                // Only provided if "include_raw" is set to true
            }
        }
    ]
}
```

## Fetch a specific opportunity {#fetchAccount}

Endpoint: `/crm/opportunities/:id`  
HTTP Method: **GET**  
Headers: API key and user token are mandatory, [see API basics](basics.md)  
Sample call (CURL):
```bash
curl -XGET \
-H 'Authorization: Bearer <api-key>' \
-H 'X-User-Token: <user-token>' \
'https://api.nango.dev/v1/crm/opportunities/ccc560e4-6bab-41fd-a0cd-fc94d5152de3'
```

#### Path parameters
- **:id** (string, uuid, required): The `id` property of the opportunity to be returned

#### Query parameters
- **include_raw** (boolean): If set to true the response will include the raw original API response of the external system with all fields & data.

Sample response (JSON):
```json
{
    "status": "ok",
    "result": {
        "id": "ccc560e4-6bab-41fd-a0cd-fc94d5152de3",
        "external_id": "3829294",
        "name": "Better Inc New Business",
        "description": "A really great company",
        "stage": "demo",
        "amount": 10000,
        "close_date": "2022-12-12T00:00:00Z",
        "probability": "0.78",
        "expected_revenue": 4000,
        "expected_revenue_currency": "USD",
        "is_won": false,
        "is_closed": false,
        "contacts": [
            "f7db1f94-9087-4ba0-aa7d-3ea96e714771"
        ],
        "accounts": [
            "4688d404-c31e-41ef-8c27-2536cc50ac32"
        ],
        "last_activity_at": "2022-08-12T08:02:29Z",
        "external_created_at": "2022-03-10T19:23:18Z",
        "external_modified_at": "2022-05-07T12:38:28Z",
        "raw_external_data": {
            // Raw response with all data as delivered by the external system.
            // Only provided if "include_raw" is set to true
        }
    }
}
```