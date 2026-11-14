/*
# Extend products table for the Indian snack catalogue

1. Purpose
- Adds columns needed to store verified Indian packaged snack data:
  trans fat, vegetarian classification, and a verification status.
- Extends the `source` check constraint so catalogue rows can be
  marked as 'catalogue' (curated, source-cited data) in addition to
  the existing 'sample' and 'user_submitted' values.
- Adds a unique constraint on (name, brand) to prevent duplicate
  catalogue entries.

2. Modified Tables
- `products`
  - `trans_fat` (numeric, nullable) — trans fat per serving in grams.
  - `vegetarian` (text, nullable) — 'veg', 'non_veg', or NULL when
    unverified.
  - `verification_status` (text, not null, default 'unverified') —
    one of 'verified', 'partially_verified', 'unverified'.
  - `source` CHECK constraint updated to also allow 'catalogue'.
  - UNIQUE constraint on (name, brand) to block duplicates.

3. Important Notes
- No existing columns are dropped or retyped — this is additive only.
- The existing 'sample' rows remain valid; the new source value
  'catalogue' is used for the curated Indian product entries.
- `verification_status` defaults to 'unverified' so user-submitted
  rows are never assumed verified.
*/

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS trans_fat numeric,
  ADD COLUMN IF NOT EXISTS vegetarian text CHECK (vegetarian IS NULL OR vegetarian = ANY (ARRAY['veg', 'non_veg'])),
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'unverified'
    CHECK (verification_status = ANY (ARRAY['verified', 'partially_verified', 'unverified']));

ALTER TABLE products DROP CONSTRAINT IF EXISTS products_source_check;
ALTER TABLE products
  ADD CONSTRAINT products_source_check
  CHECK (source = ANY (ARRAY['sample'::text, 'user_submitted'::text, 'catalogue'::text]));

DROP INDEX IF EXISTS products_name_brand_key;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_name_brand_key;
ALTER TABLE products ADD CONSTRAINT products_name_brand_key UNIQUE (name, brand);
