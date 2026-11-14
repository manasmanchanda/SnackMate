/*
# Parent passport and child preference profiles

1. New Tables
- `saved_snacks`: a parent's personal list of products. Each row links one parent to one product with a status (favourite, evaluated, or preferred alternative) and an optional personal note. A parent can save a product only once.
- `child_profiles`: one preference profile per parent containing the child's name, preferred flavours and textures, favourite snacks, disliked ingredients, food allergies, dietary restrictions and maximum budget.
2. Security
- RLS enabled on both tables.
- Only the signed-in owner can read, create, change or delete their own rows. The owner column defaults to the signed-in user so inserts succeed without the client sending it.
3. Notes
- Deleting a product removes it from every parent's saved list. Deleting a user removes their saved list and profile.
*/

CREATE TABLE IF NOT EXISTS saved_snacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'favourite' CHECK (status IN ('favourite', 'evaluated', 'alternative')),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS saved_snacks_user_idx ON saved_snacks (user_id);
CREATE INDEX IF NOT EXISTS saved_snacks_product_idx ON saved_snacks (product_id);

ALTER TABLE saved_snacks ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON saved_snacks TO authenticated;

DROP POLICY IF EXISTS "select_own_saved_snacks" ON saved_snacks;
CREATE POLICY "select_own_saved_snacks" ON saved_snacks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_saved_snacks" ON saved_snacks;
CREATE POLICY "insert_own_saved_snacks" ON saved_snacks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_saved_snacks" ON saved_snacks;
CREATE POLICY "update_own_saved_snacks" ON saved_snacks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_saved_snacks" ON saved_snacks;
CREATE POLICY "delete_own_saved_snacks" ON saved_snacks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS child_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  child_name text NOT NULL DEFAULT '',
  preferred_flavours text[] NOT NULL DEFAULT '{}',
  preferred_textures text[] NOT NULL DEFAULT '{}',
  favourite_snacks text[] NOT NULL DEFAULT '{}',
  disliked_ingredients text[] NOT NULL DEFAULT '{}',
  food_allergies text[] NOT NULL DEFAULT '{}',
  dietary_restrictions text[] NOT NULL DEFAULT '{}',
  max_budget numeric,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON child_profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_child_profile" ON child_profiles;
CREATE POLICY "select_own_child_profile" ON child_profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_child_profile" ON child_profiles;
CREATE POLICY "insert_own_child_profile" ON child_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_child_profile" ON child_profiles;
CREATE POLICY "update_own_child_profile" ON child_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_child_profile" ON child_profiles;
CREATE POLICY "delete_own_child_profile" ON child_profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
