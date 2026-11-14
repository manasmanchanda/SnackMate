/*
# Preload Indian packaged snack catalogue (corrected taste values)

1. Purpose
- Populates the products table with 54 popular Indian packaged snack
  products across chocolates, chips, biscuits, namkeen, noodles, popcorn,
  nachos, energy bars and other categories.
- All nutrition values are per serving as stated on typical Indian packs.
- Source is 'catalogue' and verification_status is 'partially_verified'.
- Corrected: taste values restricted to sweet/salty/savoury/sour/mild
  (spicy products use 'savoury' taste with 'spicy' flavour).

2. Important Notes
- Fixed UUIDs for idempotency. ON CONFLICT (name, brand) DO NOTHING.
- Prices are indicative Indian retail prices in INR (late 2026).
*/

INSERT INTO products (
  id, name, brand, category, kind, source, image_url, ingredients,
  allergens, taste, texture, flavour,
  calories, total_carbs, sugar, added_sugar, protein, total_fat,
  saturated_fat, trans_fat, fibre, sodium_mg,
  serving_size, package_quantity, price,
  vegetarian, verification_status, tags
) VALUES

-- ============ POTATO CHIPS & NAMKEEN (12) ============
(
  '00000000-0000-4000-8000-000000000101',
  'Lay''s Classic Salted', 'PepsiCo', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/19993431/pexels-photo-19993431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Potatoes, vegetable oil (sunflower/corn), salt.',
  ARRAY['wheat']::text[], 'salty', 'crunchy', 'salty',
  160, 15, 0.5, 0, 2, 10, 2, 0, 1, 170,
  '28 g (about 15 chips)', '52 g pack', 20,
  'veg', 'partially_verified', ARRAY['india','chips','salted']::text[]
),
(
  '00000000-0000-4000-8000-000000000102',
  'Lay''s India''s Magic Masala', 'PepsiCo', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/19993431/pexels-photo-19993431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Potatoes, vegetable oil, seasoning (salt, maltodextrin, spices, sugar, onion powder, garlic powder, citric acid, tomato powder, yeast extract, paprika, natural flavour).',
  ARRAY['milk']::text[], 'salty', 'crunchy', 'spicy',
  270, 27, 2, 1, 3, 17, 2, 0, 3, 340,
  '50 g', '52 g pack', 20,
  'veg', 'partially_verified', ARRAY['india','chips','masala']::text[]
),
(
  '00000000-0000-4000-8000-000000000103',
  'Lay''s American Style Cream & Onion', 'PepsiCo', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/19993431/pexels-photo-19993431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Potatoes, vegetable oil, seasoning (salt, sugar, onion powder, whey powder, skim milk powder, citric acid, lactic acid, natural flavour).',
  ARRAY['milk']::text[], 'savoury', 'crunchy', 'cheese',
  160, 15, 1, 0.5, 2, 10, 2.5, 0, 1, 160,
  '28 g', '52 g pack', 20,
  'veg', 'partially_verified', ARRAY['india','chips','cream-onion']::text[]
),
(
  '00000000-0000-4000-8000-000000000104',
  'Lay''s Spanish Tomato Tango', 'PepsiCo', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/19993431/pexels-photo-19993431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Potatoes, vegetable oil, seasoning (salt, sugar, tomato powder, onion powder, spices, citric acid, natural flavour).',
  ARRAY[]::text[], 'sour', 'crunchy', 'fruity',
  160, 15, 1, 0.5, 2, 10, 2, 0, 1, 160,
  '28 g', '52 g pack', 20,
  'veg', 'partially_verified', ARRAY['india','chips','tomato']::text[]
),
(
  '00000000-0000-4000-8000-000000000105',
  'Bingo! Mad Angles', 'ITC', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/6485538/pexels-photo-6485538.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Corn meal, rice meal, edible vegetable oil, seasoning (salt, spices, tomato powder, onion powder, garlic powder, maltodextrin, acidity regulator).',
  ARRAY['wheat']::text[], 'salty', 'crunchy', 'spicy',
  150, 18, 1, 0.5, 2, 8, 1.5, 0, 1, 220,
  '30 g', '70 g pack', 20,
  'veg', 'partially_verified', ARRAY['india','chips','spicy']::text[]
),
(
  '00000000-0000-4000-8000-000000000106',
  'Bingo! Tedhe Medhe', 'ITC', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/6485538/pexels-photo-6485538.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, edible vegetable oil, besan, seasoning (salt, spices, onion powder, garlic powder, chilli powder, mint).',
  ARRAY['wheat']::text[], 'salty', 'crunchy', 'spicy',
  140, 17, 1, 0.5, 2, 7, 1.5, 0, 1, 250,
  '30 g', '70 g pack', 20,
  'veg', 'partially_verified', ARRAY['india','chips','spicy']::text[]
),
(
  '00000000-0000-4000-8000-000000000107',
  'Uncle Chipps Spicy Treat', 'PepsiCo', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/6485538/pexels-photo-6485538.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Potatoes, edible vegetable oil, seasoning (salt, spices, onion powder, garlic powder, chilli powder).',
  ARRAY[]::text[], 'salty', 'crunchy', 'spicy',
  150, 15, 0.5, 0, 2, 9, 1.5, 0, 1, 200,
  '28 g', '52 g pack', 20,
  'veg', 'partially_verified', ARRAY['india','chips','spicy']::text[]
),
(
  '00000000-0000-4000-8000-000000000108',
  'Too Yumm! Multigrain Chips', 'Too Yumm', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/6485538/pexels-photo-6485538.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Multigrain flour (rice, corn, wheat, oat, flaxseed), edible vegetable oil, seasoning (salt, spices, herbs).',
  ARRAY['wheat']::text[], 'salty', 'crunchy', 'mild',
  130, 16, 1, 0.5, 2, 6, 1, 0, 2, 180,
  '30 g', '54 g pack', 30,
  'veg', 'partially_verified', ARRAY['india','chips','multigrain']::text[]
),
(
  '00000000-0000-4000-8000-000000000109',
  'Haldiram''s Aloo Bhujia', 'Haldiram''s', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Besan, potato, edible vegetable oil, salt, spices, chilli powder, coriander, cardamom, clove, cinnamon, asafoetida.',
  ARRAY[]::text[], 'salty', 'crunchy', 'spicy',
  150, 12, 1, 0, 4, 9, 1.5, 0, 2, 350,
  '30 g', '200 g pack', 45,
  'veg', 'partially_verified', ARRAY['india','namkeen','bhujia']::text[]
),
(
  '00000000-0000-4000-8000-000000000110',
  'Haldiram''s Moong Dal', 'Haldiram''s', 'Nuts and Seeds', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Moong dal, edible vegetable oil, salt, spices.',
  ARRAY[]::text[], 'salty', 'crunchy', 'salty',
  150, 12, 0.5, 0, 6, 8, 1, 0, 3, 280,
  '30 g', '200 g pack', 45,
  'veg', 'partially_verified', ARRAY['india','namkeen','moong-dal']::text[]
),
(
  '00000000-0000-4000-8000-000000000111',
  'Kurkure Masala Munch', 'PepsiCo', 'Puffs', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/6485538/pexels-photo-6485538.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Corn grits, edible vegetable oil, seasoning (salt, spices, onion powder, garlic powder, chilli powder, tomato powder, citric acid).',
  ARRAY['wheat']::text[], 'salty', 'crunchy', 'spicy',
  150, 17, 1, 0.5, 2, 8, 1.5, 0, 1, 230,
  '30 g', '60 g pack', 20,
  'veg', 'partially_verified', ARRAY['india','kurkure','spicy']::text[]
),
(
  '00000000-0000-4000-8000-000000000112',
  'Kurkure Chilli Chatka', 'PepsiCo', 'Puffs', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/6485538/pexels-photo-6485538.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Corn grits, edible vegetable oil, seasoning (salt, chilli powder, spices, onion powder, garlic powder, citric acid).',
  ARRAY['wheat']::text[], 'savoury', 'crunchy', 'spicy',
  150, 17, 1, 0.5, 2, 8, 1.5, 0, 1, 240,
  '30 g', '60 g pack', 20,
  'veg', 'partially_verified', ARRAY['india','kurkure','chilli']::text[]
),

-- ============ CHOCOLATES (11) ============
(
  '00000000-0000-4000-8000-000000000201',
  'Cadbury Dairy Milk', 'Cadbury', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/37857736/pexels-photo-37857736.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Sugar, milk solids, cocoa butter, cocoa solids, vegetable fats (palm, shea), emulsifiers (E442, E476), flavourings.',
  ARRAY['milk','soy']::text[], 'sweet', 'creamy', 'chocolate',
  220, 24, 23, 20, 3, 13, 8, 0.1, 1, 40,
  '25 g (6 pieces)', '52.5 g bar', 45,
  'veg', 'partially_verified', ARRAY['india','chocolate','milk-chocolate']::text[]
),
(
  '00000000-0000-4000-8000-000000000202',
  'Cadbury Dairy Milk Silk', 'Cadbury', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/37857736/pexels-photo-37857736.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Sugar, milk solids, cocoa butter, cocoa solids, vegetable fats (palm, shea), emulsifiers, flavourings.',
  ARRAY['milk','soy']::text[], 'sweet', 'creamy', 'chocolate',
  230, 24, 24, 21, 3, 14, 9, 0.1, 1, 35,
  '25 g (3 pieces)', '60 g bar', 80,
  'veg', 'partially_verified', ARRAY['india','chocolate','silk']::text[]
),
(
  '00000000-0000-4000-8000-000000000203',
  'Cadbury Dairy Milk Silk Oreo', 'Cadbury', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/37857736/pexels-photo-37857736.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Sugar, milk solids, cocoa butter, cocoa solids, wheat flour, vegetable fats, emulsifiers, flavourings, Oreo biscuit pieces.',
  ARRAY['milk','soy','wheat']::text[], 'sweet', 'crunchy', 'chocolate',
  240, 25, 24, 21, 3, 15, 9, 0.1, 1, 45,
  '25 g (3 pieces)', '60 g bar', 90,
  'veg', 'partially_verified', ARRAY['india','chocolate','silk-oreo']::text[]
),
(
  '00000000-0000-4000-8000-000000000204',
  'Cadbury Dairy Milk Crackle', 'Cadbury', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/37857736/pexels-photo-37857736.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Sugar, milk solids, cocoa butter, cocoa solids, vegetable fats, crisped rice (rice flour, sugar, salt), emulsifiers, flavourings.',
  ARRAY['milk','soy']::text[], 'sweet', 'crunchy', 'chocolate',
  220, 25, 23, 20, 3, 12, 7, 0.1, 1, 40,
  '25 g (6 pieces)', '52.5 g bar', 50,
  'veg', 'partially_verified', ARRAY['india','chocolate','crackle']::text[]
),
(
  '00000000-0000-4000-8000-000000000205',
  'Cadbury 5 Star', 'Cadbury', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/31443060/pexels-photo-31443060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Sugar, glucose syrup, vegetable fat, cocoa solids, milk solids, caramelised sugar, peanuts, emulsifiers, flavourings.',
  ARRAY['milk','soy','peanuts']::text[], 'sweet', 'chewy', 'chocolate',
  230, 27, 20, 18, 3, 12, 7, 0.1, 1, 50,
  '25 g (2 fingers)', '40.8 g bar', 15,
  'veg', 'partially_verified', ARRAY['india','chocolate','caramel']::text[]
),
(
  '00000000-0000-4000-8000-000000000206',
  'Cadbury Perk', 'Cadbury', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/31443060/pexels-photo-31443060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Sugar, glucose syrup, vegetable fat, cocoa solids, milk solids, crisped rice, emulsifiers, flavourings.',
  ARRAY['milk','soy']::text[], 'sweet', 'crunchy', 'chocolate',
  210, 26, 20, 17, 2, 11, 6, 0.1, 0.5, 45,
  '22 g (2 bars)', '33 g pack', 10,
  'veg', 'partially_verified', ARRAY['india','chocolate','wafer']::text[]
),
(
  '00000000-0000-4000-8000-000000000207',
  'Nestle Munch', 'Nestle', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/31443060/pexels-photo-31443060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Sugar, vegetable fat, cocoa solids, wheat flour, milk solids, yeast, emulsifiers, flavourings.',
  ARRAY['milk','soy','wheat']::text[], 'sweet', 'crunchy', 'chocolate',
  210, 25, 19, 16, 2, 12, 7, 0.1, 1, 40,
  '21 g (2 bars)', '32 g pack', 10,
  'veg', 'partially_verified', ARRAY['india','chocolate','wafer']::text[]
),
(
  '00000000-0000-4000-8000-000000000208',
  'Nestle KitKat', 'Nestle', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/31443060/pexels-photo-31443060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Sugar, wheat flour, vegetable fat, cocoa solids, milk solids, yeast, emulsifiers, flavourings.',
  ARRAY['milk','soy','wheat']::text[], 'sweet', 'crunchy', 'chocolate',
  210, 25, 20, 17, 2, 11, 6, 0.1, 1, 40,
  '21 g (2 fingers)', '37 g pack', 30,
  'veg', 'partially_verified', ARRAY['india','chocolate','wafer']::text[]
),
(
  '00000000-0000-4000-8000-000000000209',
  'Snickers', 'Mars', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/31443060/pexels-photo-31443060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Milk chocolate (sugar, cocoa butter, chocolate, skim milk, lactose, milkfat), peanuts, corn syrup, sugar, skim milk, milkfat, soy lecithin, artificial flavour.',
  ARRAY['milk','soy','peanuts']::text[], 'sweet', 'chewy', 'chocolate',
  250, 29, 24, 22, 4, 13, 5, 0.1, 1, 90,
  '50 g (1 bar)', '50 g bar', 45,
  'non_veg', 'partially_verified', ARRAY['india','chocolate','peanut']::text[]
),
(
  '00000000-0000-4000-8000-000000000210',
  'Ferrero Rocher', 'Ferrero', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/31443060/pexels-photo-31443060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Milk chocolate, hazelnuts, sugar, palm oil, cocoa, skim milk powder, whey powder, emulsifiers, flavourings, wafer.',
  ARRAY['milk','soy','nuts','wheat']::text[], 'sweet', 'crunchy', 'chocolate',
  73, 7, 6, 5, 1, 5, 2, 0, 0.5, 12,
  '12 g (1 piece)', '16 pieces / 200 g box', 350,
  'veg', 'partially_verified', ARRAY['india','chocolate','hazelnut']::text[]
),
(
  '00000000-0000-4000-8000-000000000211',
  'Nestle Milkybar', 'Nestle', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/31443060/pexels-photo-31443060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Sugar, milk solids, cocoa butter, vegetable fat, emulsifiers, flavourings.',
  ARRAY['milk','soy']::text[], 'sweet', 'creamy', 'mild',
  210, 24, 23, 20, 2, 12, 8, 0.1, 0.5, 35,
  '25 g (6 pieces)', '37.5 g bar', 25,
  'veg', 'partially_verified', ARRAY['india','chocolate','white']::text[]
),

-- ============ BISCUITS & COOKIES (10) ============
(
  '00000000-0000-4000-8000-000000000301',
  'Oreo Original', 'Cadbury', 'Biscuits', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/37817590/pexels-photo-37817590.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, sugar, edible vegetable oil, cocoa solids, invert syrup, raising agents, salt, emulsifiers, flavourings.',
  ARRAY['wheat','soy']::text[], 'sweet', 'crunchy', 'chocolate',
  160, 23, 13, 11, 1, 7, 2, 0, 1, 110,
  '29 g (3 biscuits)', '120 g pack', 40,
  'veg', 'partially_verified', ARRAY['india','biscuit','sandwich']::text[]
),
(
  '00000000-0000-4000-8000-000000000302',
  'Oreo Chocolate Cream', 'Cadbury', 'Biscuits', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/37817590/pexels-photo-37817590.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, sugar, edible vegetable oil, cocoa solids, chocolate paste, invert syrup, raising agents, salt, emulsifiers, flavourings.',
  ARRAY['wheat','soy','milk']::text[], 'sweet', 'crunchy', 'chocolate',
  170, 24, 14, 12, 1, 7, 2.5, 0, 1, 115,
  '29 g (3 biscuits)', '120 g pack', 45,
  'veg', 'partially_verified', ARRAY['india','biscuit','chocolate']::text[]
),
(
  '00000000-0000-4000-8000-000000000303',
  'Britannia Good Day Cashew', 'Britannia', 'Cookies', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/5599487/pexels-photo-5599487.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, sugar, edible vegetable oil, cashew, invert syrup, milk solids, raising agents, salt, emulsifiers, flavourings.',
  ARRAY['wheat','milk','nuts']::text[], 'sweet', 'soft', 'mild',
  150, 19, 9, 7, 2, 7, 3, 0, 0.5, 120,
  '24 g (2 pieces)', '120 g pack', 35,
  'veg', 'partially_verified', ARRAY['india','cookie','cashew']::text[]
),
(
  '00000000-0000-4000-8000-000000000304',
  'Britannia Bourbon', 'Britannia', 'Biscuits', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/5599487/pexels-photo-5599487.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, sugar, edible vegetable oil, cocoa solids, chocolate, invert syrup, raising agents, salt, emulsifiers, flavourings.',
  ARRAY['wheat','soy','milk']::text[], 'sweet', 'crunchy', 'chocolate',
  160, 22, 12, 10, 2, 7, 3, 0, 1, 130,
  '26 g (2 biscuits)', '150 g pack', 40,
  'veg', 'partially_verified', ARRAY['india','biscuit','chocolate']::text[]
),
(
  '00000000-0000-4000-8000-000000000305',
  'Britannia Treat Jam', 'Britannia', 'Cookies', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/5599487/pexels-photo-5599487.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, sugar, edible vegetable oil, jam (sugar, glucose syrup, citric acid, pectin), invert syrup, raising agents, salt, emulsifiers, flavourings.',
  ARRAY['wheat']::text[], 'sweet', 'soft', 'fruity',
  150, 22, 11, 9, 1, 6, 2.5, 0, 0.5, 100,
  '24 g (2 pieces)', '150 g pack', 30,
  'veg', 'partially_verified', ARRAY['india','cookie','jam']::text[]
),
(
  '00000000-0000-4000-8000-000000000306',
  'Parle-G Gluco Biscuits', 'Parle', 'Biscuits', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/5599465/pexels-photo-5599465.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, sugar, edible vegetable oil, invert syrup, raising agents, milk solids, salt, emulsifiers, flavourings.',
  ARRAY['wheat','milk','soy']::text[], 'sweet', 'crunchy', 'mild',
  260, 44, 14, 10, 4, 7, 3.5, 0.1, 0.5, 160,
  '56 g (8 biscuits)', '100 g pack', 10,
  'veg', 'partially_verified', ARRAY['india','biscuit','glucose']::text[]
),
(
  '00000000-0000-4000-8000-000000000307',
  'Hide & Seek Chocolate Chip', 'Parle', 'Cookies', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/5599465/pexels-photo-5599465.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, sugar, edible vegetable oil, chocolate chips (sugar, cocoa mass, cocoa butter, emulsifier), invert syrup, raising agents, salt, emulsifiers, flavourings.',
  ARRAY['wheat','milk','soy']::text[], 'sweet', 'crunchy', 'chocolate',
  160, 22, 11, 9, 2, 7, 3, 0, 0.5, 120,
  '26 g (3 biscuits)', '100 g pack', 35,
  'veg', 'partially_verified', ARRAY['india','cookie','chocolate-chip']::text[]
),
(
  '00000000-0000-4000-8000-000000000308',
  'Sunfeast Dark Fantasy Choco Fills', 'ITC', 'Cookies', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/5599465/pexels-photo-5599465.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, sugar, edible vegetable oil, cocoa solids, chocolate, invert syrup, raising agents, salt, emulsifiers, flavourings.',
  ARRAY['wheat','milk','soy']::text[], 'sweet', 'soft', 'chocolate',
  170, 22, 13, 11, 2, 8, 3.5, 0, 0.5, 110,
  '25 g (3 biscuits)', '75 g pack', 50,
  'veg', 'partially_verified', ARRAY['india','cookie','chocolate']::text[]
),
(
  '00000000-0000-4000-8000-000000000309',
  'Britannia Marie Gold', 'Britannia', 'Biscuits', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/5599465/pexels-photo-5599465.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, sugar, edible vegetable oil, invert syrup, raising agents, salt, emulsifiers, flavourings.',
  ARRAY['wheat','soy']::text[], 'mild', 'crunchy', 'mild',
  140, 22, 6, 4, 2, 5, 2, 0, 0.5, 130,
  '26 g (4 biscuits)', '250 g pack', 35,
  'veg', 'partially_verified', ARRAY['india','biscuit','marie']::text[]
),
(
  '00000000-0000-4000-8000-000000000310',
  'Sunfeast Mom''s Magic', 'ITC', 'Cookies', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/5599465/pexels-photo-5599465.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, sugar, edible vegetable oil, invert syrup, milk solids, raising agents, salt, emulsifiers, flavourings.',
  ARRAY['wheat','milk','soy']::text[], 'sweet', 'soft', 'mild',
  150, 20, 8, 6, 2, 7, 3, 0, 0.5, 120,
  '25 g (3 biscuits)', '200 g pack', 40,
  'veg', 'partially_verified', ARRAY['india','cookie','butter']::text[]
),

-- ============ NOODLES (3) ============
(
  '00000000-0000-4000-8000-000000000401',
  'Maggi 2-Minute Masala Noodles', 'Nestle', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/4541393/pexels-photo-4541393.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, palm oil, salt, wheat gluten, minerals (calcium carbonate, iron), tastemaker (wheat flour, salt, groundnut protein, sugar, palm oil, iodised salt, starch, thickener (508), flavour enhancer (635), toasted onion flakes, acidity regulator (330), colour (150d)).',
  ARRAY['wheat']::text[], 'savoury', 'soft', 'spicy',
  310, 41, 1.4, 0.8, 6, 12, 6, 0.1, 2, 750,
  '70 g (1 cake + tastemaker)', '70 g pack', 14,
  'veg', 'partially_verified', ARRAY['india','noodles','masala']::text[]
),
(
  '00000000-0000-4000-8000-000000000402',
  'Maggi Atta Noodles', 'Nestle', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/4541393/pexels-photo-4541393.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, palm oil, salt, wheat gluten, minerals, tastemaker (wheat flour, salt, spices, sugar, palm oil, flavour enhancer (635), onion flakes, acidity regulator (330)).',
  ARRAY['wheat']::text[], 'savoury', 'soft', 'spicy',
  300, 40, 1.5, 0.9, 7, 11, 5.5, 0.1, 3, 720,
  '70 g (1 cake + tastemaker)', '72.5 g pack', 25,
  'veg', 'partially_verified', ARRAY['india','noodles','atta']::text[]
),
(
  '00000000-0000-4000-8000-000000000403',
  'Yippee! Magic Masala Noodles', 'ITC', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/4541393/pexels-photo-4541393.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, palm oil, salt, wheat gluten, minerals, tastemaker (wheat flour, salt, spices, sugar, palm oil, flavour enhancer (635), onion flakes, garlic flakes, acidity regulator).',
  ARRAY['wheat']::text[], 'savoury', 'soft', 'spicy',
  310, 42, 1.5, 0.9, 6, 12, 6, 0.1, 2, 730,
  '70 g (1 cake + masala)', '72 g pack', 14,
  'veg', 'partially_verified', ARRAY['india','noodles','masala']::text[]
),

-- ============ OTHER PACKAGED SNACKS (18) ============
(
  '00000000-0000-4000-8000-000000000501',
  'Pringles Original', 'Kellogg''s', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/19993431/pexels-photo-19993431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Dried potatoes, vegetable oil (sunflower, corn), rice flour, wheat starch, corn flour, maltodextrin, salt, monosodium glutamate.',
  ARRAY['wheat']::text[], 'salty', 'crunchy', 'salty',
  150, 16, 1, 0.5, 1, 9, 2.5, 0, 1, 150,
  '30 g (about 16 crisps)', '107 g can', 99,
  'veg', 'partially_verified', ARRAY['india','chips','original']::text[]
),
(
  '00000000-0000-4000-8000-000000000502',
  'Pringles Sour Cream & Onion', 'Kellogg''s', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/19993431/pexels-photo-19993431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Dried potatoes, vegetable oil, rice flour, wheat starch, corn flour, maltodextrin, salt, monosodium glutamate, sour cream (cream, culture), onion powder, sugar, flavouring.',
  ARRAY['wheat','milk']::text[], 'savoury', 'crunchy', 'cheese',
  150, 16, 1, 0.5, 1, 9, 2.5, 0, 1, 160,
  '30 g (about 16 crisps)', '107 g can', 110,
  'veg', 'partially_verified', ARRAY['india','chips','sour-cream']::text[]
),
(
  '00000000-0000-4000-8000-000000000503',
  'Cornitos Nachos Cheese & Herbs', 'Cornitos', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/27244303/pexels-photo-27244303.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Corn meal, edible vegetable oil, seasoning (cheese powder, salt, herbs, spices, onion powder, garlic powder).',
  ARRAY['milk']::text[], 'savoury', 'crunchy', 'cheese',
  140, 17, 1, 0.5, 2, 7, 1.5, 0, 2, 180,
  '30 g', '60 g pack', 40,
  'veg', 'partially_verified', ARRAY['india','nachos','cheese']::text[]
),
(
  '00000000-0000-4000-8000-000000000504',
  'Cornitos Nachos Tikka Masala', 'Cornitos', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/27244303/pexels-photo-27244303.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Corn meal, edible vegetable oil, seasoning (salt, spices, tomato powder, onion powder, garlic powder, chilli powder, citric acid).',
  ARRAY['milk']::text[], 'savoury', 'crunchy', 'spicy',
  140, 17, 1, 0.5, 2, 7, 1.5, 0, 2, 200,
  '30 g', '60 g pack', 40,
  'veg', 'partially_verified', ARRAY['india','nachos','tikka']::text[]
),
(
  '00000000-0000-4000-8000-000000000505',
  'Act II Butter Popcorn', 'Act II', 'Popcorn', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/5331317/pexels-photo-5331317.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Popcorn, vegetable oil, salt, butter flavouring.',
  ARRAY['milk']::text[], 'salty', 'crunchy', 'mild',
  130, 14, 1, 0.5, 2, 7, 1.5, 0, 2, 200,
  '30 g (popped)', '75 g pack (pops 4 cups)', 30,
  'veg', 'partially_verified', ARRAY['india','popcorn','butter']::text[]
),
(
  '00000000-0000-4000-8000-000000000506',
  'Act II Tomato Tango Popcorn', 'Act II', 'Popcorn', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/5331317/pexels-photo-5331317.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Popcorn, vegetable oil, seasoning (salt, tomato powder, sugar, onion powder, garlic powder, spices, citric acid).',
  ARRAY['milk']::text[], 'sour', 'crunchy', 'fruity',
  130, 15, 2, 1, 2, 7, 1.5, 0, 2, 220,
  '30 g (popped)', '75 g pack (pops 4 cups)', 30,
  'veg', 'partially_verified', ARRAY['india','popcorn','tomato']::text[]
),
(
  '00000000-0000-4000-8000-000000000507',
  'Nutella Hazelnut Spread', 'Ferrero', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/31443060/pexels-photo-31443060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Sugar, palm oil, hazelnuts, cocoa, skim milk powder, whey powder, emulsifiers (soy lecithin), flavourings (vanillin).',
  ARRAY['milk','soy','nuts']::text[], 'sweet', 'creamy', 'chocolate',
  200, 22, 21, 19, 2, 11, 4, 0, 1, 15,
  '37 g (2 tablespoons)', '350 g jar', 350,
  'veg', 'partially_verified', ARRAY['india','spread','hazelnut']::text[]
),
(
  '00000000-0000-4000-8000-000000000508',
  'Peanut Chikki', 'Laxmi', 'Nuts and Seeds', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/9951856/pexels-photo-9951856.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Peanuts, jaggery, glucose syrup.',
  ARRAY['peanuts']::text[], 'sweet', 'crunchy', 'mild',
  180, 20, 14, 0, 6, 9, 2, 0, 2, 40,
  '30 g (2 pieces)', '200 g pack', 50,
  'veg', 'partially_verified', ARRAY['india','chikki','peanut']::text[]
),
(
  '00000000-0000-4000-8000-000000000509',
  'Yogabar Muesli & Energy Bar', 'Yogabar', 'Bars', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/32214637/pexels-photo-32214637.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Rolled oats, almonds, honey, puffed rice, dark chocolate chips (cocoa, sugar, emulsifier), sunflower seeds, pumpkin seeds, sea salt.',
  ARRAY['nuts','milk']::text[], 'sweet', 'chewy', 'chocolate',
  140, 18, 8, 5, 4, 6, 2, 0, 3, 80,
  '35 g (1 bar)', '35 g bar', 60,
  'veg', 'partially_verified', ARRAY['india','energy-bar','granola']::text[]
),
(
  '00000000-0000-4000-8000-000000000510',
  'Nature Valley Crunchy Oats & Honey', 'General Mills', 'Bars', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/32214637/pexels-photo-32214637.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Rolled oats, sugar, canola oil, rice flour, honey, brown sugar syrup, salt, soy lecithin, baking soda, natural flavour.',
  ARRAY['soy']::text[], 'sweet', 'crunchy', 'honey',
  190, 29, 11, 8, 4, 7, 1, 0, 2, 110,
  '42 g (2 bars)', '84 g twin pack', 80,
  'veg', 'partially_verified', ARRAY['india','energy-bar','granola']::text[]
),
(
  '00000000-0000-4000-8000-000000000511',
  'Munch Chocolate Wafer Mini', 'Nestle', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/31443060/pexels-photo-31443060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Sugar, vegetable fat, cocoa solids, wheat flour, milk solids, yeast, emulsifiers, flavourings.',
  ARRAY['milk','soy','wheat']::text[], 'sweet', 'crunchy', 'chocolate',
  105, 13, 10, 8, 1, 6, 3, 0.1, 0.5, 20,
  '10.5 g (1 mini bar)', '10.5 g pack', 5,
  'veg', 'partially_verified', ARRAY['india','chocolate','mini']::text[]
),
(
  '00000000-0000-4000-8000-000000000512',
  'Britannia NutriChoice Digestive', 'Britannia', 'Biscuits', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/5599465/pexels-photo-5599465.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, edible vegetable oil, sugar, wheat bran, invert syrup, raising agents, salt, emulsifiers, flavourings.',
  ARRAY['wheat','soy']::text[], 'mild', 'crunchy', 'mild',
  130, 18, 4, 3, 2, 5, 2, 0, 2, 150,
  '24 g (2 biscuits)', '250 g pack', 50,
  'veg', 'partially_verified', ARRAY['india','biscuit','digestive']::text[]
),
(
  '00000000-0000-4000-8000-000000000513',
  'Haldiram''s Bhujia Sev', 'Haldiram''s', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Besan, edible vegetable oil, salt, spices, chilli powder, coriander, cardamom, asafoetida.',
  ARRAY[]::text[], 'salty', 'crunchy', 'spicy',
  150, 11, 1, 0, 4, 10, 1.5, 0, 2, 380,
  '30 g', '400 g pack', 75,
  'veg', 'partially_verified', ARRAY['india','namkeen','sev']::text[]
),
(
  '00000000-0000-4000-8000-000000000514',
  'Bikaji Soya Sticks', 'Bikaji', 'Puffs', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Soya flour, rice flour, edible vegetable oil, salt, spices, chilli powder.',
  ARRAY['soy']::text[], 'salty', 'crunchy', 'spicy',
  140, 14, 1, 0.5, 4, 8, 1.5, 0, 2, 300,
  '30 g', '180 g pack', 25,
  'veg', 'partially_verified', ARRAY['india','namkeen','soya']::text[]
),
(
  '00000000-0000-4000-8000-000000000515',
  'Bingo Mad Angles Achaari Masti', 'ITC', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/6485538/pexels-photo-6485538.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Corn meal, rice meal, edible vegetable oil, seasoning (salt, spices, mango powder, onion powder, garlic powder, chilli powder).',
  ARRAY['wheat']::text[], 'savoury', 'crunchy', 'spicy',
  150, 18, 1, 0.5, 2, 8, 1.5, 0, 1, 230,
  '30 g', '70 g pack', 20,
  'veg', 'partially_verified', ARRAY['india','chips','achaari']::text[]
),
(
  '00000000-0000-4000-8000-000000000516',
  'Doritos Nacho Cheese', 'PepsiCo', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/27244303/pexels-photo-27244303.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Corn meal, vegetable oil, seasoning (cheese powder, salt, whey powder, buttermilk powder, onion powder, garlic powder, natural flavour).',
  ARRAY['milk','wheat']::text[], 'savoury', 'crunchy', 'cheese',
  140, 17, 1, 0.5, 2, 7, 1.5, 0, 1, 180,
  '28 g (about 11 chips)', '92.4 g pack', 60,
  'veg', 'partially_verified', ARRAY['india','nachos','cheese']::text[]
),
(
  '00000000-0000-4000-8000-000000000517',
  'Cadbury Bytes Chocolate', 'Cadbury', 'Other', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/31443060/pexels-photo-31443060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Wheat flour, sugar, vegetable fat, cocoa solids, milk solids, filling (sugar, glucose syrup, cocoa, vegetable fat), raising agents, emulsifiers, flavourings.',
  ARRAY['wheat','milk','soy']::text[], 'sweet', 'crunchy', 'chocolate',
  140, 18, 10, 8, 1, 6, 3, 0.1, 0.5, 80,
  '14 g (1 pack)', '14 g pack', 5,
  'veg', 'partially_verified', ARRAY['india','snack','chocolate']::text[]
),
(
  '00000000-0000-4000-8000-000000000518',
  'Balaji Wafers Salted', 'Balaji', 'Chips', 'packaged', 'catalogue',
  'https://images.pexels.com/photos/19993431/pexels-photo-19993431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Potatoes, edible vegetable oil, salt.',
  ARRAY[]::text[], 'salty', 'crunchy', 'salty',
  160, 15, 0.5, 0, 2, 10, 2, 0, 1, 180,
  '28 g', '180 g pack', 30,
  'veg', 'partially_verified', ARRAY['india','wafers','salted']::text[]
)

ON CONFLICT (name, brand) DO NOTHING;
