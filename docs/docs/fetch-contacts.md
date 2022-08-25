---
sidebar_position: 4
sidebar_label: Fetch Contacts
---

# Fetch contacts endpoint

The contacts api offers the following endpoints:
- [Fetch all contacts](#fetchContacts)
- [Fetch a specific contact by id](#fetchContact)

For an example of the `Contact` object check the examples below.

## Fetch all contacts {#fetchContacts}

Endpoint: `/crm/contacts`  
HTTP Method: **GET**  
Headers: API key and user token are mandatory, [see API basics](basics.md)  
Sample call (CURL):
```bash
curl -XGET \
-H 'Authorization: Bearer <api-key>' \
-H 'X-User-Token: <user-token>' \
'https://api.nango.dev/v1/crm/contacts'
```

#### Query parameters
The following query parameters are available (all are optional)
- **email** (string): Comma separated string of email addresses. If present, only contacts where one of the email addresses on record is present in the list are returned.
- **account** (string, uuid): Comma separates string of account UUIDs. If present, only contacts where the account uuid is present in the list are returned.
- **name** (string): If present only contacts which have `name` in either their `first_name` or `last_name` property are returned.
- **include_raw** (boolean): If set to true the response will include the raw original API response of the external system with all fields & data.

Sample response (JSON):
```json
{
    "status": "ok",
    "result": [
        {
            "id": "ccc560e4-6bab-41fd-a0cd-fc94d5152de3",
            "external_id": "128492",
            "first_name": "Rolf",
            "last_name": "Sample",
            "job_title": "Director of Operations",
            "account": "f7db1f94-9087-4ba0-aa7d-3ea96e714771",
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
            ]
            "email_adresses": [
                {
                    "email": "rolph@supercord.com",
                    "email_type": "WORK"
                },
                {
                    "email": "rolph@gmail.com",
                    "email_type": "PERSONAL"
                }
            ],
            "phone_numbers": [
                {
                    "phone_number": "+1738929928",
                    "phone_number_type": "MOBILE"
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

## Fetch a specific contact {#fetchContact}

Endpoint: `/crm/contacts/:id`  
HTTP Method: **GET**  
Headers: API key and user token are mandatory, [see API basics](basics.md)  
Sample call (CURL):
```bash
curl -XGET \
-H 'Authorization: Bearer <api-key>' \
-H 'X-User-Token: <user-token>' \
'https://api.nango.dev/v1/crm/contacts/ccc560e4-6bab-41fd-a0cd-fc94d5152de3'
```

#### Path parameters
- **:id** (string, uuid, required): The `id` property of the contact to be returned

#### Query parameters
- **include_raw** (boolean): If set to true the response will include the raw original API response of the external system with all fields & data.

Sample response (JSON):
```json
{
    "status": "ok",
    "result": {
        "id": "ccc560e4-6bab-41fd-a0cd-fc94d5152de3",
        "external_id": "128492",
        "first_name": "Rolf",
        "last_name": "Sample",
        "job_title": "Director of Operations",
        "account": "f7db1f94-9087-4ba0-aa7d-3ea96e714771",
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
        ]
        "email_adresses": [
            {
                "email": "rolph@supercord.com",
                "email_type": "WORK"
            },
            {
                "email": "rolph@gmail.com",
                "email_type": "PERSONAL"
            }
        ],
        "phone_numbers": [
            {
                "phone_number": "+1738929928",
                "phone_number_type": "MOBILE"
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