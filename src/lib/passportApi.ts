import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/productModel';

export type SavedStatus = 'favourite' | 'evaluated' | 'alternative';

export type SavedSnack = {
  id: string;
  product_id: string;
  status: SavedStatus;
  note: string | null;
  created_at: string;
  products: Product | null;
};

export type ChildProfile = {
  child_name: string;
  preferred_flavours: string[];
  preferred_textures: string[];
  favourite_snacks: string[];
  disliked_ingredients: string[];
  food_allergies: string[];
  dietary_restrictions: string[];
  max_budget: number | null;
};

export const EMPTY_CHILD_PROFILE: ChildProfile = {
  child_name: '',
  preferred_flavours: [],
  preferred_textures: [],
  favourite_snacks: [],
  disliked_ingredients: [],
  food_allergies: [],
  dietary_restrictions: [],
  max_budget: null,
};

export async function fetchSavedSnacks(): Promise<SavedSnack[]> {
  const { data, error } = await supabase
    .from('saved_snacks')
    .select('id, product_id, status, note, created_at, products(*)')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as SavedSnack[];
}

export async function saveSnack(productId: string, status: SavedStatus = 'favourite'): Promise<void> {
  const { error } = await supabase.from('saved_snacks').upsert(
    { product_id: productId, status },
    { onConflict: 'user_id,product_id', ignoreDuplicates: true },
  );
  if (error) throw new Error(error.message);
}

export async function fetchSavedProductIds(): Promise<string[]> {
  const { data, error } = await supabase.from('saved_snacks').select('product_id');
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.product_id as string);
}

export async function removeSavedSnack(id: string): Promise<void> {
  const { error } = await supabase.from('saved_snacks').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function removeSavedProduct(productId: string): Promise<void> {
  const { error } = await supabase.from('saved_snacks').delete().eq('product_id', productId);
  if (error) throw new Error(error.message);
}

export async function updateSavedSnack(id: string, changes: { status: SavedStatus; note: string | null }): Promise<void> {
  const { error } = await supabase.from('saved_snacks').update(changes).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function fetchChildProfile(): Promise<ChildProfile | null> {
  const { data, error } = await supabase
    .from('child_profiles')
    .select(
      'child_name, preferred_flavours, preferred_textures, favourite_snacks, disliked_ingredients, food_allergies, dietary_restrictions, max_budget',
    )
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as ChildProfile | null) ?? null;
}

export async function saveChildProfile(profile: ChildProfile): Promise<void> {
  const { data: existing, error: lookupError } = await supabase
    .from('child_profiles')
    .select('id')
    .maybeSingle();
  if (lookupError) throw new Error(lookupError.message);

  const result = existing
    ? await supabase.from('child_profiles').update({ ...profile, updated_at: new Date().toISOString() }).eq('id', existing.id)
    : await supabase.from('child_profiles').insert(profile);
  if (result.error) throw new Error(result.error.message);
}
