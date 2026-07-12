import jwt from 'jsonwebtoken';
import { env } from './src/config/env.js';

const token = jwt.sign(
  { id: 'stub-uuid', email: 'admin@mhatretraders.com', role: 'SUPER_ADMIN' },
  env.JWT_SECRET,
  { expiresIn: '1h' }
);

async function testEndpoint(name, path) {
  console.log(`Sending request to ${name} (${path})...`);
  const start = Date.now();
  try {
    const res = await fetch(`http://127.0.0.1:5000/api/v1${path}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      signal: AbortSignal.timeout(15000)
    });
    console.log(`Status of ${name}:`, res.status);
    console.log(`Time taken (ms):`, Date.now() - start);
    const body = await res.json();
    if (res.status >= 400) {
      console.log(`Error Response:`, JSON.stringify(body, null, 2));
    } else {
      console.log(`Success! Data keys:`, Object.keys(body.data || {}));
      if (body.data && body.data.products) {
        console.log(`Loaded`, body.data.products.length, `products`);
      }
      if (body.data && body.data.bills) {
        console.log(`Loaded`, body.data.bills.length, `bills`);
      }
    }
  } catch (err) {
    console.error(`Request ${name} failed:`, err);
  }
  console.log('--------------------------------------------------');
}

async function main() {
  await testEndpoint('Admin Dashboard', '/admin/dashboard/stats');
  await testEndpoint('Admin Products', '/admin/products');
  await testEndpoint('Admin Billing', '/admin/billing');
}

main();
