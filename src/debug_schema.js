const SUPABASE_URL = 'https://btaugojhgqkfzlysfhon.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0YXVnb2poZ3FrZnpseXNmaG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MjU2NjcsImV4cCI6MjA5MjAwMTY2N30.AevlCtYz3xOuY-C689DjASxQZ9gnsZfGQbtam-h9uEE';

async function debug() {
  console.log('--- Fetching Category List ---');
  const catRes = await fetch(`${SUPABASE_URL}/rest/v1/categories`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  console.log('Categories:', await catRes.json());

  console.log('\n--- Attempting Minimal Product Insertion ---');
  const prodRes = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: 'POST',
    headers: { 
      'apikey': SUPABASE_KEY, 
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      title: 'Debug Piece',
      description: 'Test',
      price: 999,
      image_url: 'https://example.com/img.jpg',
      affiliate_link: 'https://example.com',
      is_featured: false,
      curator_rating: 5
    })
  });
  
  const result = await prodRes.json();
  console.log('Insertion Result:', result);
}

debug();
