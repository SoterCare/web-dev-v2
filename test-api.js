const tests = [
  { path: '/auth/register', payload: { name: 'Test User', email: 'test@sotercare.com' } },
  { path: '/auth/verify', payload: { email: 'test@sotercare.com', otp: '123456' } },
  { path: '/auth/login', payload: { email: 'test@sotercare.com' } },
  { path: '/auth/login-verify', payload: { email: 'test@sotercare.com', otp: '123456' } }
];
const baseUrl = 'https://unlikely-caryn-sotercare-873e6112.koyeb.app';

(async () => {
  for (const t of tests) {
    console.log(`\n> POST ${t.path}`);
    try {
      const res = await fetch(baseUrl + t.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Origin': 'http://localhost:3000' },
        body: JSON.stringify(t.payload)
      });
      console.log(`  Status: ${res.status} ${res.statusText}`);
      console.log(`  CORS-Origin:`, res.headers.get('access-control-allow-origin') || 'MISSING!');
      const text = await res.text();
      console.log(`  Response:`, text.substring(0, 150).replace(/\n/g, ' '));
    } catch(e) {
      console.log(`  Fetch Error:`, e.message);
    }
  }
})();
