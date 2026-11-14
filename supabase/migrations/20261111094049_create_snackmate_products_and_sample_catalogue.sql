/*
# SnackMate product catalogue

1. New Tables
- `products`: packaged snacks and homemade snack ideas. Every nutrition field is nullable so that information that has not been provided is stored as "unavailable" rather than invented.
  - `source` is either `sample` (starter catalogue entries shipped with the app) or `user_submitted` (added by a parent).
  - `created_by` is the signed-in parent who added a user-submitted product.
  - `taste`, `texture`, `flavour`, `tags` drive the look-alike finder, comparison indicators and Explore filters.
2. Seed data
- 13 starter entries (9 packaged, 4 homemade) with fixed ids so the migration is safe to replay.
3. Storage
- Public bucket `product-images` for product photos. Anyone can view images; signed-in parents can upload, replace and delete only files inside their own folder.
4. Security
- RLS enabled on `products`.
- The catalogue is public: anon and authenticated can read every product.
- Only signed-in users can insert, update or delete, and only rows they created with source `user_submitted`. Sample entries cannot be edited or removed by users.

# Notes
1. Nutrition values depend on serving size; sample values are illustrative starter data.
2. Column type changes or drops are never performed by this migration.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text,
  category text NOT NULL DEFAULT 'Other',
  kind text NOT NULL DEFAULT 'packaged' CHECK (kind IN ('packaged', 'homemade')),
  source text NOT NULL DEFAULT 'sample' CHECK (source IN ('sample', 'user_submitted')),
  image_url text,
  ingredients text,
  allergens text[] NOT NULL DEFAULT '{}',
  taste text CHECK (taste IN ('sweet', 'salty', 'savoury', 'sour', 'mild')),
  texture text CHECK (texture IN ('crunchy', 'soft', 'chewy', 'creamy')),
  flavour text,
  calories numeric,
  total_carbs numeric,
  sugar numeric,
  added_sugar numeric,
  protein numeric,
  total_fat numeric,
  saturated_fat numeric,
  fibre numeric,
  sodium_mg numeric,
  serving_size text,
  package_quantity text,
  price numeric,
  prep_minutes integer,
  preparation text,
  tags text[] NOT NULL DEFAULT '{}',
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_created_by_idx ON products (created_by);
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON products TO authenticated;

DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_products" ON products;
CREATE POLICY "insert_own_products" ON products FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = created_by AND source = 'user_submitted');

DROP POLICY IF EXISTS "update_own_products" ON products;
CREATE POLICY "update_own_products" ON products FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by AND source = 'user_submitted')
  WITH CHECK (auth.uid() = created_by AND source = 'user_submitted');

DROP POLICY IF EXISTS "delete_own_products" ON products;
CREATE POLICY "delete_own_products" ON products FOR DELETE
  TO authenticated USING (auth.uid() = created_by AND source = 'user_submitted');

INSERT INTO products (id, name, brand, category, kind, source, image_url, ingredients, allergens, taste, texture, flavour, calories, total_carbs, sugar, added_sugar, protein, total_fat, saturated_fat, fibre, sodium_mg, serving_size, package_quantity, price, prep_minutes, preparation, tags, created_by) VALUES
('00000000-0000-4000-8000-000000000001', 'Cheesy Corn Puffs', 'Puffy Co', 'Puffs', 'packaged', 'sample', 'https://images.pexels.com/photos/34203235/pexels-photo-34203235.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Corn meal, vegetable oil, cheese powder (milk), salt, paprika', '{milk}', 'salty', 'crunchy', 'Cheese', 150, 15, 1, 0, 2, 9, 3.5, 1, 290, '28 g (about 1 small handful)', '85 g bag', 2.50, NULL, NULL, '{school}', NULL),
('00000000-0000-4000-8000-000000000002', 'Sea Salt Potato Chips', 'Crisp Harvest', 'Chips', 'packaged', 'sample', 'https://images.pexels.com/photos/6485538/pexels-photo-6485538.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Potatoes, sunflower oil, sea salt', '{}', 'salty', 'crunchy', 'Sea salt', 160, 15, 0, 0, 2, 10, 1, 1.2, 170, '28 g (about 1 small handful)', '120 g bag', 2.20, NULL, NULL, '{school}', NULL),
('00000000-0000-4000-8000-000000000003', 'Chocolate Chip Cookies', 'Oven Joy', 'Cookies', 'packaged', 'sample', 'https://images.pexels.com/photos/31323236/pexels-photo-31323236.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Wheat flour, sugar, butter (milk), chocolate chips (sugar, cocoa butter, milk), eggs, raising agent', '{wheat,milk,egg}', 'sweet', 'chewy', 'Chocolate', 190, 25, 14, 12, 2, 9, 4, 1, 150, '30 g (1 cookie)', '6 cookie pack, 180 g', 3.50, NULL, NULL, '{school}', NULL),
('00000000-0000-4000-8000-000000000004', 'Oat and Honey Granola Bar', 'Trailbite', 'Bars', 'packaged', 'sample', 'https://images.pexels.com/photos/32214637/pexels-photo-32214637.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Rolled oats, honey, almonds, rice crisps, sunflower oil, sea salt', '{wheat,nuts}', 'sweet', 'chewy', 'Honey oat', 130, 22, 10, 7, 3, 4, 1.5, 3, 95, '1 bar (30 g)', '5 bar box, 150 g', 4.00, NULL, NULL, '{school,quick}', NULL),
('00000000-0000-4000-8000-000000000005', 'Butter Popcorn', 'Pop Hut', 'Popcorn', 'packaged', 'sample', 'https://images.pexels.com/photos/5331317/pexels-photo-5331317.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Popcorn kernels, sunflower oil, butter flavouring (milk), salt', '{milk}', 'salty', 'crunchy', 'Butter', 120, 17, 0, 0, 3, 5, 1, 3, 180, '28 g (about 2 cups)', '100 g bag', 2.00, NULL, NULL, '{school,quick}', NULL),
('00000000-0000-4000-8000-000000000006', 'Roasted Mixed Nut Clusters', 'Nutty Bay', 'Nuts and Seeds', 'packaged', 'sample', 'https://images.pexels.com/photos/37180553/pexels-photo-37180553.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Almonds, cashews, walnuts, sunflower oil, sea salt', '{nuts}', 'savoury', 'crunchy', 'Roasted', 170, 8, 2, 1, 5, 14, 2, 2, 120, '30 g', '150 g jar', 3.80, NULL, NULL, '{quick}', NULL),
('00000000-0000-4000-8000-000000000007', 'Cheddar Cheese Crackers', 'Snack Farm', 'Crackers', 'packaged', 'sample', 'https://images.pexels.com/photos/19239123/pexels-photo-19239123.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Wheat flour, cheddar cheese (milk), vegetable oil, salt', '{wheat,milk}', 'savoury', 'crunchy', 'Cheddar', 140, 18, 1, 0, 3, 6, 2.5, 1, 260, '30 g', '200 g box', 2.80, NULL, NULL, '{school}', NULL),
('00000000-0000-4000-8000-000000000008', 'Strawberry Yogurt Bites', 'Little Dairy', 'Dairy Snacks', 'packaged', 'sample', 'https://images.pexels.com/photos/14122621/pexels-photo-14122621.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Yogurt powder (milk), sugar, strawberry pieces, rice flour', '{milk}', 'sweet', 'soft', 'Strawberry', 90, 13, 9, 4, 4, 2, 1.2, 0, 35, '20 g (2 bites)', '100 g pouch', 1.90, NULL, NULL, '{school,quick}', NULL),
('00000000-0000-4000-8000-000000000009', 'Lightly Salted Rice Cakes', 'Light Crunch', 'Rice Cakes', 'packaged', 'sample', 'https://images.pexels.com/photos/9893210/pexels-photo-9893210.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Brown rice, salt', '{}', 'mild', 'crunchy', 'Lightly salted', 35, 7.5, 0.2, 0, 0.7, 0.3, 0.1, 0.4, 25, '1 cake (9 g)', '120 g pack', 1.50, NULL, NULL, '{quick}', NULL),
('00000000-0000-4000-8000-000000000010', 'Coconut Date Energy Bites', NULL, 'Homemade', 'homemade', 'sample', 'https://images.pexels.com/photos/8996217/pexels-photo-8996217.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Dates, desiccated coconut, rolled oats, peanut butter, pinch of salt', '{nuts}', 'sweet', 'chewy', 'Coconut date', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 'Blend 8 pitted dates with 2 tablespoons peanut butter and a pinch of salt. Mix in 4 tablespoons oats and 2 tablespoons coconut. Roll into small balls and chill for 20 minutes.', '{homemade,school,party}', NULL),
('00000000-0000-4000-8000-000000000011', 'Veggie Sticks with Hummus', NULL, 'Homemade', 'homemade', 'sample', 'https://images.pexels.com/photos/9134584/pexels-photo-9134584.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Carrot, cucumber, bell pepper, chickpeas, tahini, lemon juice', '{sesame}', 'savoury', 'crunchy', 'Herb', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10, 'Cut carrot, cucumber and bell pepper into sticks. Blend chickpeas, tahini, lemon juice and a little water into a smooth dip. Serve chilled.', '{homemade,picnic,school}', NULL),
('00000000-0000-4000-8000-000000000012', 'Apple Slices with Peanut Butter', NULL, 'Homemade', 'homemade', 'sample', 'https://images.pexels.com/photos/33489594/pexels-photo-33489594.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Apple, peanut butter', '{peanuts}', 'sweet', 'crunchy', 'Peanut butter', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, 'Wash and core an apple, then slice into thin wedges. Serve with a spoon of peanut butter for dipping. Squeeze lemon on the apple to keep it from browning.', '{homemade,quick,school}', NULL),
('00000000-0000-4000-8000-000000000013', 'Yogurt Berry Parfait', NULL, 'Homemade', 'homemade', 'sample', 'https://images.pexels.com/photos/14122621/pexels-photo-14122621.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Plain yogurt, mixed berries, oats, honey', '{milk,wheat}', 'sweet', 'creamy', 'Berry', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, 'Spoon plain yogurt into a small cup. Layer with berries and a sprinkle of oats. Drizzle a little honey on top if liked.', '{homemade,quick,picnic}', NULL)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS products_source_idx ON products (source);

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
CREATE POLICY "public_read_product_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "insert_own_product_images" ON storage.objects;
CREATE POLICY "insert_own_product_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "update_own_product_images" ON storage.objects;
CREATE POLICY "update_own_product_images" ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "delete_own_product_images" ON storage.objects;
CREATE POLICY "delete_own_product_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);
