const SUPABASE_URL = 'https://btaugojhgqkfzlysfhon.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0YXVnb2poZ3FrZnpseXNmaG9uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQyNTY2NywiZXhwIjoyMDkyMDAxNjY3fQ.LofPUEnRBYREV-WVcJNp2oGOP8twUWaXOn7eqknpTmE';

async function check() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?limit=1`, {
    headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
  });
  const data = await res.json();
  if (data.length > 0) {
    console.log('Actual Columns in DB:', Object.keys(data[0]));
  } else {
    console.log('Table is empty. Attempting to insert minimal row...');
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: { 
        'apikey': KEY, 
        'Authorization': `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ title: 'Schema Test', price: 0, affiliate_link: 'http://test.com' })
    });
    const result = await insertRes.json();
    console.log('Minimal Insert Result:', result);
  }
}

check();
