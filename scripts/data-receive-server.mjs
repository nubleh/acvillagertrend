import * as http from "http";
import * as fs from 'fs';

const hostname = '127.0.0.1';
const port = 3002;

const server = http.createServer((req, res) => {
  let body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    console.log('POSTed: ' + body);
    try {
      const data = JSON.parse(body);
      if (data.type === 'results') {
        fs.writeFileSync(
          `./dump/${data.dateString}.json`,
          JSON.stringify(data.results, null, 2)
        );
      }
    } catch(e){
      console.log(e);
    }
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.writeHead(200);
    res.end('received');
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
