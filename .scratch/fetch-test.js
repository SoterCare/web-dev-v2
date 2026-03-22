const http = require('http');

http.get('http://localhost:3000/api/test-ws', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    require('fs').writeFileSync('.scratch/test-ws.json', data);
    console.log('Wrote output to .scratch/test-ws.json');
    // Exit clean
    process.exit(0);
  });
}).on('error', (err) => {
  require('fs').writeFileSync('.scratch/test-ws.json', JSON.stringify({ error: err.message }));
  process.exit(0);
});
