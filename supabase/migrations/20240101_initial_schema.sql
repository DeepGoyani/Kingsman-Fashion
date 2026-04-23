-- Kingsman Fashion Initial Schema

-- 1. Create Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default Categories
INSERT INTO categories (slug, label) VALUES
  ('all', 'All'),
  ('sherwani', 'Sherwanis'),
  ('lehenga', 'Lehengas'),
  ('suit', 'Suits'),
  ('accessory', 'Accessories');

-- 2. Create Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category UUID REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    purchase_price INTEGER NOT NULL,
    rent_price_per_day INTEGER NOT NULL,
    security_deposit INTEGER NOT NULL,
    sizes TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    is_rentable BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    shipping_address JSONB,
    stripe_session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Order Items / Rentals Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    size TEXT,
    type TEXT NOT NULL CHECK (type IN ('PURCHASE', 'RENTAL')),
    start_date DATE,
    end_date DATE,
    item_price INTEGER NOT NULL,
    deposit_amount INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Set up Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products and Categories should be readable by everyone
CREATE POLICY "Public profiles are viewable by everyone." ON products FOR SELECT USING (true);
CREATE POLICY "Public categories are viewable by everyone." ON categories FOR SELECT USING (true);

-- Admins can do everything (Assuming admin check via email or custom claim, simplistic for now: allow true temporarily for setup)
-- CREATE POLICY "Admins have full access" ON products USING (auth.jwt() ->> 'email' IN ('admin@kingsman.com'));

-- Users can view their own orders
CREATE POLICY "Users can view their own orders." ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders." ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own order items." ON order_items FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create their own order items." ON order_items FOR INSERT WITH CHECK (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
);
