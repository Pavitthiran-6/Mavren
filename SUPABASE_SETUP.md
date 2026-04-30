# Supabase Setup Guide for Violet Ether

To get your affiliate product discovery app fully functional, follow these steps in your Supabase project dashboard.

## 1. Environment Variables
Copy the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase Settings -> API into your local `.env` file.

## 2. PostgreSQL Tables
Run the following SQL in the **SQL Editor** of your Supabase dashboard:

```sql
-- Create Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  discount_price DECIMAL,
  image_url TEXT,
  category TEXT REFERENCES categories(name),
  tags TEXT[],
  affiliate_link TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  curator_rating DECIMAL DEFAULT 5.0,
  curator_verdict TEXT,
  highs TEXT[],
  lows TEXT[],
  pros TEXT[],
  cons TEXT[],
  is_new_arrival BOOLEAN DEFAULT false,
  is_under_999 BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Wishlist table
CREATE TABLE wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Create Contact Messages table
CREATE TABLE contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_read BOOLEAN DEFAULT false
);

-- Create Analytics tables
CREATE TABLE product_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE product_clicks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

## 4. Row Level Security (RLS)
Run these commands in the SQL Editor to protect your data. This setup assumes a single-admin model where the authenticated user has full access.

```sql
-- Categories: Everyone can read
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for categories" ON categories
  FOR SELECT USING (true);
CREATE POLICY "Full access for authenticated admins" ON categories
  FOR ALL TO authenticated USING (true);

-- Products: Everyone can read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for products" ON products
  FOR SELECT USING (true);
CREATE POLICY "Full access for authenticated admins" ON products
  FOR ALL TO authenticated USING (true);

-- Wishlist: Users can only see/edit their own
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own wishlist" ON wishlist
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Contact Messages: Public can insert, Admin can read/update
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view and update contact messages" ON contact_messages
  FOR ALL TO authenticated USING (true);

-- Analytics: Public can insert, Admin can read
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can track views" ON product_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view analytics" ON product_views FOR SELECT TO authenticated USING (true);

ALTER TABLE product_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can track clicks" ON product_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view clicks" ON product_clicks FOR SELECT TO authenticated USING (true);

-- Storage (Bucket: product-images) 
-- Go to Storage -> Policies -> product-images bucket
-- Add policy: "Authenticated users can upload"
-- Definition: auth.uid() IS NOT NULL
```

## 5. Security Note
This project has been simplified to remove the `profiles` table. Access to the `/admin` area on the frontend is granted to any user who can successfully log in via Supabase Auth. For production, ensure you restrict sign-ups in your Supabase Auth settings or update the RLS policies to check for your specific Admin UID.
