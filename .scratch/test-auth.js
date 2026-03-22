async function test() {
  const tokenRes = await fetch("http://localhost:3000/api/auth/token");
  const { token } = await tokenRes.json();
  
  const urlsToTest = [
    { name: "Auth Header on custom domain", url: "https://backend.sotercare.com/realtime", headers: { "Authorization": `Bearer ${token}` } },
    { name: "Query ?token on custom domain", url: "https://backend.sotercare.com/realtime?token=" + token, headers: {} },
    { name: "Query ?accessToken on custom domain", url: "https://backend.sotercare.com/realtime?accessToken=" + token, headers: {} },
    { name: "Auth Header on Koyeb URL", url: "https://unlikely-caryn-sotercare-873e6112.koyeb.app/realtime", headers: { "Authorization": `Bearer ${token}` } },
    { name: "Cookie Header on custom domain", url: "https://backend.sotercare.com/realtime", headers: { "Cookie": `accessToken=${token}` } },
  ];

  const results = [];
  for (const t of urlsToTest) {
    try {
      const res = await fetch(t.url, {
        headers: {
          "Connection": "Upgrade",
          "Upgrade": "websocket",
          "Sec-WebSocket-Key": "dGhlIHNhbXBsZSBub25jZQ==",
          "Sec-WebSocket-Version": "13",
          ...t.headers
        }
      });
      results.push({ name: t.name, status: res.status });
    } catch(err) {
      results.push({ name: t.name, error: err.message });
    }
  }
  
  // Write output
  require('fs').writeFileSync('.scratch/ws-results.json', JSON.stringify(results, null, 2));
}

test();
