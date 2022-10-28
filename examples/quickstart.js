import https from 'https'

var body = {
    url: 'https://pokeapi.co/api/v2/pokemon',
    method: 'get',
    headers: {},
    body: {},
    unique_key: 'name',
    paging_request_path: '',
    paging_response_path: 'next'
};

var postData = JSON.stringify(body);

var options = {
  hostname: 'localhost:3000',
  port: 3000,
  path: 'v1/syncs',
  method: 'POST',
  headers: {
       'Content-Type': 'application/json',
       'Content-Length': postData.length
     }
};

var req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(postData);
req.end();