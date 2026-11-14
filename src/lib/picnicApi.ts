import { supabase } from '@/lib/supabase';

export type PicnicSnack = {
  productId: string;
  name: string;
  quantity: number;
  packed: boolean;
};

export type PicnicPlan = {
  id: string;
  event_name: string;
  event_date: string | null;
  children_count: number;
  dietary_requirements: string[];
  budget: number | null;
  snacks: PicnicSnack[];
  created_at: string;
};

export type PicnicPlanInput = {
  event_name: string;
  event_date: string | null;
  children_count: number;
  dietary_requirements: string[];
  budget: number | null;
  snacks: PicnicSnack[];
};

export const EMPTY_PLAN: PicnicPlanInput = {
  event_name: '',
  event_date: null,
  children_count: 1,
  dietary_requirements: [],
  budget: null,
  snacks: [],
};

export async function fetchPicnicPlans(): Promise<PicnicPlan[]> {
  const { data, error } = await supabase
    .from('picnic_plans')
    .select('id, event_name, event_date, children_count, dietary_requirements, budget, snacks, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as PicnicPlan[];
}

export async function createPicnicPlan(input: PicnicPlanInput): Promise<PicnicPlan> {
  const { data, error } = await supabase
    .from('picnic_plans')
    .insert(input)
    .select('id, event_name, event_date, children_count, dietary_requirements, budget, snacks, created_at')
    .single();
  if (error) throw new Error(error.message);
  return data as PicnicPlan;
}

export async function updatePicnicPlan(id: string, input: PicnicPlanInput): Promise<void> {
  const { error } = await supabase
    .from('picnic_plans')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deletePicnicPlan(id: string): Promise<void> {
  const { error } = await supabase.from('picnic_plans').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
