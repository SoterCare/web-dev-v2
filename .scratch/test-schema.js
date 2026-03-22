const http = require('http');
const fs = require('fs');

function fetchPath(path, filename) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000/api${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(filename, data);
        console.log(`Saved ${path} to ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(err);
      resolve();
    });
  });
}

async function run() {
  await fetchPath('/timeline/vitals?metric=skinTemp&period=day', '.scratch/vitals-schema.json');
  await fetchPath('/timeline/events?limit=3', '.scratch/events-schema.json');
}

run();
