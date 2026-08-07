const http = require('http');

// Test if server is running
const req = http.get('http://localhost:9999/test-dropdown.html', (res) => {
  console.log('✅ Server is running on http://localhost:9999');
  console.log('📄 Test file: http://localhost:9999/test-dropdown.html');
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (data.includes('form-control-lg')) {
      console.log('✅ Test HTML file contains form-control-lg class reference');
    }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.log('❌ Server not responding:', e.message);
  process.exit(1);
});
