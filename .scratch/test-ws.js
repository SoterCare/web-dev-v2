const WebSocket = require('ws');

// Function to test WS
function testWS(url, headers = {}) {
  console.log(`Testing ${url} with headers:`, headers);
  const ws = new WebSocket(url, { headers });

  ws.on('open', () => {
    console.log(`[OPEN] Successfully connected to ${url}`);
    ws.close();
  });

  ws.on('error', (err) => {
    console.log(`[ERROR] Connection failed: ${err.message}`);
  });

  ws.on('unexpected-response', (req, res) => {
    console.log(`[UNEXPECTED] HTTP Status Code Rejection: ${res.statusCode} ${res.statusMessage}`);
    console.log(`[HEADERS] Server returned:`, res.headers);
  });

  ws.on('close', (code, reason) => {
    console.log(`[CLOSE] Code ${code}, Reason: ${reason.toString()}`);
  });
}

// Just try connecting without auth first (simulate browser)
testWS('wss://backend.sotercare.com/realtime');

// Try with ?token=... (the query string method)
testWS('wss://backend.sotercare.com/realtime?token=fake_token');
