import http from 'http'

var body = {
    url: 'https://pokeapi.co/api/v2/pokemon',
    response_path: 'results',
    paging_url_path: 'next',
    max_total: 100
};

var postData = JSON.stringify(body);

var options = {
  hostname: 'localhost',
  port: 3003,
  path: '/v1/syncs',
  method: 'POST',
  headers: {
       'Content-Type': 'application/json',
       'Content-Length': postData.length
     }
};

var req = http.request(options, (res) => {
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