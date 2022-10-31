---
sidebar_label: 'Real World Examples'
sidebar_position: 5
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Real world examples

Seeing is believing: We have collected some real-world examples of cool things you can build with Nango here.

Need help with one of these (or another API/endpoint)?🤔  
Reach out on our [Community Slack](https://nango.dev/slack), we are online all day and happy to help!

## Sync HubSpot (CRM) contacts

**Endpoint docs:** https://developers.hubspot.com/docs/api/crm/contacts  
(click on the "Endpoints" tab, the use the dropdown to find the endpoint or scroll down)

**Example API CURL request:**
```bash
curl --request GET \
  --url 'https://api.hubapi.com/crm/v3/objects/contacts?limit=10&archived=false' \
  --header 'authorization: Bearer YOUR_ACCESS_TOKEN' # Replace the access token with your HubSpot access token
```

**Example API response:**
```json
{
  "results": [
    {
      "id": 1028392,
      "properties": {
        "company": "Biglytics",
        "createdate": "2019-10-30T03:30:17.883Z",
        "email": "bcooper@biglytics.net",
        "firstname": "Bryan",
        "lastmodifieddate": "2019-12-07T16:50:06.678Z",
        "lastname": "Cooper",
        "phone": "(877) 929-0687",
        "website": "biglytics.net"
      }
    }
  ],
  "paging": {
    "next": {
      "after": "NTI1Cg%3D%3D",
      "link": "?after=NTI1Cg%3D%3D"
    }
  }
}
```

**Nango Sync config to sync contacts from HubSpot to your local database:**
<Tabs groupId="programming-language">
  <TabItem value="node" label="Node SDK">

```ts
import {Nango, NangoHttpMethod} from '@nangohq/node-client'

let nango_options = {
    method: NangoHttpMethod.Get,
    headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'  // Replace with user's access token
    },
    response_path: 'results',
    unique_key: 'id',
    paging_request_path: 'after',
    paging_response_path: 'paging.next.after'
};

Nango.sync('https://api.hubapi.com/crm/v3/objects/contacts?limit=10&archived=false', nango_options);
```
  </TabItem>
  <TabItem value="curl" label="REST API (curl)">

  ```bash
  curl --request POST \
--url http://localhost:3003/v1/syncs \
 --header "Content-type: application/json" \
 --data '
 {
"url": "https://api.hubapi.com/crm/v3/objects/contacts?limit=10&archived=false",
"method": "GET",
"headers": { "Authorization": "Bearer YOUR_ACCESS_TOKEN"},
"response_path": "results",
"unique_key": "id",
"paging_request_path": "after",
"paging_response_path": "paging.next.after"
}'
  ```
  </TabItem>
</Tabs>