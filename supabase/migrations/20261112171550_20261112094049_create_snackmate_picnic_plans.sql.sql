/*
# Create picnic_plans table for the Picnic Snack Planner

1. Purpose
- Stores each user's picnic/party snack plans so they can build a packing
  checklist and mark items as packed across sessions.

2. New Tables
- `picnic_plans`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to the authenticated user; references
    auth.users with cascade delete so deleting a user removes their plans)
  - `event_name` (text, not null; e.g. "Park picnic", "Birthday party")
  - `event_date` (date, nullable; when the event happens)
  - `children_count` (integer, not null, default 1)
  - `dietary_requirements` (text[], default '{}'; allergies and restrictions)
  - `budget` (numeric, nullable; max spend in the user's currency)
  - `snacks` (jsonb, default '[]'; array of
    { productId, name, quantity, packed } objects)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

3. Security
- Enable RLS on `picnic_plans`.
- Grant SELECT, INSERT, UPDATE, DELETE to `authenticated` only (the app
  requires sign-in; the anon role has no access).
- Owner-scoped CRUD: each authenticated user can only access rows they own,
  enforced with auth.uid() = user_id on all four verbs.

4. Important Notes
- `user_id` has DEFAULT auth.uid() so frontend inserts that omit user_id
  still satisfy the INSERT WITH CHECK policy.
- The snacks array is stored as jsonb to keep the plan self-contained even
  if a product is later edited or removed from the catalogue.
*/

CREATE TABLE IF NOT EXISTS picnic_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name text NOT NULL,
  event_date date,
  children_count integer NOT NULL DEFAULT 1 CHECK (children_count >= 1),
  dietary_requirements text[] NOT NULL DEFAULT '{}'::text[],
  budget numeric CHECK (budget IS NULL OR budget >= 0),
  snacks jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE picnic_plans ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON picnic_plans TO authenticated;

DROP POLICY IF EXISTS "select_own_picnic_plans" ON picnic_plans;
CREATE POLICY "select_own_picnic_plans" ON picnic_plans FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_picnic_plans" ON picnic_plans;
CREATE POLICY "insert_own_picnic_plans" ON picnic_plans FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_picnic_plans" ON picnic_plans;
CREATE POLICY "update_own_picnic_plans" ON picnic_plans FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_picnic_plans" ON picnic_plans;
CREATE POLICY "delete_own_picnic_plans" ON picnic_plans FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
