---
sidebar_position: 5
sidebar_label: Fetch Accounts
---

# Fetch accounts endpoint

The accounts api offers the following endpoints:
- [Fetch all accounts](#fetchAccounts)
- [Fetch a specific account by id](#fetchAccount)

For an example of the `Account` object check the examples below.

## Fetch all accounts {#fetchAccounts}

Endpoint: `/crm/accounts`  
HTTP Method: **GET**  
Headers: API key and user token are mandatory, [see API basics](basics.md)  
Sample call (CURL):
```bash
curl -XGET \
-H 'Authorization: Bearer <api-key>' \
-H 'X-User-Token: <user-token>' \
'https://api.nango.dev/v1/crm/accounts'
```

#### Query parameters
The following query parameters are available (all are optional):
- **name** (string): If set only accounts where `name` (the query parameter) appears in the account's `name` property will be returned.
- **include_raw** (boolean): If set to true the response will include the raw original API response of the external system with all fields & data.

Sample response (JSON):
```json
{
    "status": "ok",
    "result": [
        {
            "id": "ccc560e4-6bab-41fd-a0cd-fc94d5152de3",
            "external_id": "3829294",
            "name": "Great Inc.",
            "description": "A really great company",
            "industry": "Developer Tools",
            "annual_revenue": "10000000",
            "number_of_employees": "493",
            "website": "https://greatcorp.com",
            "contacts": [
                "f7db1f94-9087-4ba0-aa7d-3ea96e714771"
            ],
            "opportunities": [
                {
                    "opportunity_id": "4688d404-c31e-41ef-8c27-2536cc50ac32",
                    "opportunity_stage": "demo",
                    "opportunity_closed": false
                }
            ],
            "adresses": [
                {
                    "street_1": "1379 Lexington Ave",
                    "street_2": "Golden Gate Park",
                    "city": "New York",
                    "state": "NY",
                    "zip_code": "94122",
                    "country": "USA",
                    "address_type": "WORK"
                }
            ],
            "phone_numbers": [
                {
                    "phone_number": "+1738929928",
                    "phone_number_type": "LANDLINE"
                }
            ],
            "last_activity_at": "2022-08-28T08:02:29Z",
            "external_created_at": "2008-12-10T19:23:18Z",
            "external_modified_at": "2022-06-07T12:38:28Z",
            "raw_external_data": {
                // Raw response with all data as delivered by the external system.
                // Only provided if "include_raw" is set to true
            }
        }
    ]
}
```

## Fetch a specific account {#fetchAccount}

Endpoint: `/crm/accounts/:id`  
HTTP Method: **GET**  
Headers: API key and user token are mandatory, [see API basics](basics.md)  
Sample call (CURL):
```bash
curl -XGET \
-H 'Authorization: Bearer <api-key>' \
-H 'X-User-Token: <user-token>' \
'https://api.nango.dev/v1/crm/accounts/ccc560e4-6bab-41fd-a0cd-fc94d5152de3'
```

#### Path parameters
- **:id** (string, uuid, required): The `id` property of the account to be returned

#### Query parameters
- **include_raw** (boolean): If set to true the response will include the raw original API response of the external system with all fields & data.

Sample response (JSON):
```json
{
    "status": "ok",
    "result": {
        "id": "ccc560e4-6bab-41fd-a0cd-fc94d5152de3",
        "external_id": "3829294",
        "name": "Great Inc.",
        "description": "A really great company",
        "industry": "Developer Tools",
        "annual_revenue": "10000000",
        "number_of_employees": "493",
        "website": "https://greatcorp.com",
        "contacts": [
            "f7db1f94-9087-4ba0-aa7d-3ea96e714771"
        ],
        "opportunities": [
            {
                "opportunity_id": "4688d404-c31e-41ef-8c27-2536cc50ac32",
                "opportunity_stage": "demo",
                "opportunity_closed": false
            }
        ],
        "adresses": [
            {
                "street_1": "1379 Lexington Ave",
                "street_2": "Golden Gate Park",
                "city": "New York",
                "state": "NY",
                "zip_code": "94122",
                "country": "USA",
                "address_type": "WORK"
            }
        ],
        "phone_numbers": [
            {
                "phone_number": "+1738929928",
                "phone_number_type": "LANDLINE"
            }
        ],
        "last_activity_at": "2022-08-28T08:02:29Z",
        "external_created_at": "2008-12-10T19:23:18Z",
        "external_modified_at": "2022-06-07T12:38:28Z",
        "raw_external_data": {
            // Raw response with all data as delivered by the external system.
            // Only provided if "include_raw" is set to true
        }
    }
}
```