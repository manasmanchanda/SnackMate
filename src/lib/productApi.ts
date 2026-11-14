import { supabase } from '@/lib/supabase';
import type { Product, ProductInput } from '@/lib/productModel';

const PRODUCT_IMAGE_BUCKET = 'product-images';

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*').order('name');
  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Product | null) ?? null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert({ ...input, source: 'user_submitted', kind: 'packaged' })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data as Product;
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  const { error } = await supabase.from('products').update(input).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function uploadProductImage(userId: string, file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
