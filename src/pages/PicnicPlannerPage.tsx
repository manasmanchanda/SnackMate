import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, CircleDot, PartyPopper, Plus, Search, Trash2, X } from 'lucide-react';
import { ErrorNotice, EmptyState, LoadingBlock, PageHeader, SignInPrompt } from '@/components/ui';
import { ProductCard } from '@/components/ProductCard';
import { useAuth } from '@/lib/auth';
import { useProducts } from '@/lib/useProducts';
import { ALLERGENS, titleCase, type Product } from '@/lib/productModel';
import {
  createPicnicPlan,
  deletePicnicPlan,
  fetchPicnicPlans,
  updatePicnicPlan,
  EMPTY_PLAN,
  type PicnicPlan,
  type PicnicPlanInput,
  type PicnicSnack,
} from '@/lib/picnicApi';

const EVENT_OPTIONS = [
  'Park picnic',
  'Birthday party',
  'Play date',
  'School lunchbox',
  'Beach day',
  'Movie night',
  'Family outing',
  'Other',
];

function allergenFlags(product: Product, avoid: string[]): string[] {
  const hits: string[] = [];
  for (const a of avoid) {
    if (product.allergens?.includes(a)) hits.push(a);
  }
  return hits;
}

export function PicnicPlannerPage() {
  const { user, loading: authLoading } = useAuth();
  const { products, loading: productsLoading, error: productsError } = useProducts();

  const [plans, setPlans] = useState<PicnicPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PicnicPlanInput>(EMPTY_PLAN);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    if (!user) return;
    setPlansLoading(true);
    setPlansError(null);
    try {
      setPlans(await fetchPicnicPlans());
    } catch (err) {
      setPlansError(err instanceof Error ? err.message : 'Could not load your picnic plans.');
    } finally {
      setPlansLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const resetForm = () => {
    setForm(EMPTY_PLAN);
    setEditingId(null);
    setShowPicker(false);
    setPickerQuery('');
    setSaveError(null);
  };

  const startNew = () => {
    resetForm();
  };

  const startEdit = (plan: PicnicPlan) => {
    setForm({
      event_name: plan.event_name,
      event_date: plan.event_date,
      children_count: plan.children_count,
      dietary_requirements: plan.dietary_requirements ?? [],
      budget: plan.budget,
      snacks: plan.snacks ?? [],
    });
    setEditingId(plan.id);
    setShowPicker(false);
    setPickerQuery('');
    setSaveError(null);
  };

  const updateSnack = (productId: string, changes: Partial<PicnicSnack>) => {
    setForm((prev) => ({
      ...prev,
      snacks: prev.snacks.map((s) => (s.productId === productId ? { ...s, ...changes } : s)),
    }));
  };

  const removeSnack = (productId: string) => {
    setForm((prev) => ({ ...prev, snacks: prev.snacks.filter((s) => s.productId !== productId) }));
  };

  const addSnack = (product: Product) => {
    if (form.snacks.some((s) => s.productId === product.id)) {
      setShowPicker(false);
      setPickerQuery('');
      return;
    }
    setForm((prev) => ({
      ...prev,
      snacks: [...prev.snacks, { productId: product.id, name: product.name, quantity: 1, packed: false }],
    }));
    setShowPicker(false);
    setPickerQuery('');
  };

  const togglePacked = (productId: string) => {
    updateSnack(productId, { packed: !form.snacks.find((s) => s.productId === productId)?.packed });
  };

  const toggleAvoid = (allergen: string) => {
    setForm((prev) => ({
      ...prev,
      dietary_requirements: prev.dietary_requirements.includes(allergen)
        ? prev.dietary_requirements.filter((a) => a !== allergen)
        : [...prev.dietary_requirements, allergen],
    }));
  };

  const handleSave = async () => {
    setSaveError(null);
    if (!form.event_name.trim()) {
      setSaveError('Please choose an event name.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updatePicnicPlan(editingId, form);
      } else {
        await createPicnicPlan(form);
      }
      await loadPlans();
      resetForm();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save your plan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePicnicPlan(id);
      if (editingId === id) resetForm();
      await loadPlans();
    } catch (err) {
      setPlansError(err instanceof Error ? err.message : 'Could not delete the plan.');
    }
  };

  const pickerResults = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    return products
      .filter((p) => !q || p.name.toLowerCase().includes(q) || (p.brand ?? '').toLowerCase().includes(q))
      .slice(0, 24);
  }, [products, pickerQuery]);

  const packedCount = form.snacks.filter((s) => s.packed).length;
  const totalItems = form.snacks.reduce((sum, s) => sum + s.quantity, 0);
  const estCost = form.snacks.reduce((sum, s) => {
    const p = products.find((prod) => prod.id === s.productId);
    return sum + (p?.price ?? 0) * s.quantity;
  }, 0);

  if (authLoading) return <LoadingBlock label="Checking your account..." />;

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Picnic Snack Planner"
          title="Plan your next outing"
          description="Build a snack checklist for a picnic or party, add items from the catalogue, and tick them off as you pack."
        />
        <SignInPrompt message="Sign in to create and save your picnic snack plans." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Picnic Snack Planner"
        title="Plan your next outing"
        description="Build a snack checklist for a picnic or party, add items from the catalogue, and tick them off as you pack."
        action={
          editingId === null && form.event_name === '' ? null : (
            <button type="button" onClick={startNew} className="btn-secondary">
              <Plus className="h-4 w-4" /> New plan
            </button>
          )
        }
      />

      {productsError && <ErrorNotice message={productsError} />}
      {plansError && <ErrorNotice message={plansError} />}

      <section className="card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <PartyPopper className="h-5 w-5 text-mint-700" />
          <h2 className="font-display text-xl font-semibold">
            {editingId ? 'Edit your plan' : 'Create a new plan'}
          </h2>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-bold text-ink-800">Event</span>
            <input
              type="text"
              list="picnic-events"
              value={form.event_name}
              onChange={(e) => setForm({ ...form, event_name: e.target.value })}
              placeholder="e.g. Park picnic"
              className="input"
            />
            <datalist id="picnic-events">
              {EVENT_OPTIONS.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-ink-800">Event date</span>
            <input
              type="date"
              value={form.event_date ?? ''}
              onChange={(e) => setForm({ ...form, event_date: e.target.value || null })}
              className="input"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-ink-800">Number of children</span>
            <input
              type="number"
              min={1}
              value={form.children_count}
              onChange={(e) => setForm({ ...form, children_count: Math.max(1, Number(e.target.value) || 1) })}
              className="input"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-ink-800">Budget (per child)</span>
            <input
              type="number"
              min={0}
              step="0.50"
              value={form.budget ?? ''}
              onChange={(e) => setForm({ ...form, budget: e.target.value === '' ? null : Number(e.target.value) })}
              placeholder="Optional"
              className="input"
            />
          </label>
        </div>

        <div className="mt-6">
          <span className="text-sm font-bold text-ink-800">Dietary requirements to avoid</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {ALLERGENS.map((a) => {
              const active = form.dietary_requirements.includes(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAvoid(a)}
                  className={`rounded-full px-3 py-1.5 text-sm font-bold capitalize transition ${
                    active ? 'bg-peach-200 text-peach-900' : 'bg-cream-100 text-ink-700 hover:bg-cream-200'
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold">Snack checklist</h3>
          <button type="button" onClick={() => setShowPicker(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add snacks
          </button>
        </div>

        {form.snacks.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-cream-100 px-4 py-6 text-center text-sm text-ink-700">
            No snacks added yet. Use the button above to pick snacks from the catalogue.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {form.snacks.map((snack) => {
              const product = products.find((p) => p.id === snack.productId);
              const flags = product ? allergenFlags(product, form.dietary_requirements) : [];
              const overBudget = form.budget != null && product?.price != null && product.price > form.budget;
              return (
                <li key={snack.productId} className="flex flex-col gap-3 rounded-2xl border border-cream-200 bg-white p-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => togglePacked(snack.productId)}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      snack.packed ? 'border-mint-600 bg-mint-600 text-white' : 'border-cream-300 text-transparent hover:border-mint-400'
                    }`}
                    aria-label={snack.packed ? 'Mark as not packed' : 'Mark as packed'}
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold ${snack.packed ? 'text-ink-400 line-through' : 'text-ink-900'}`}>{snack.name}</p>
                    {flags.length > 0 && (
                      <p className="mt-0.5 text-xs font-semibold text-peach-700">
                        Contains: {flags.map(titleCase).join(', ')}
                      </p>
                    )}
                    {overBudget && (
                      <p className="mt-0.5 text-xs font-semibold text-peach-700">
                        Over your per-child budget
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-sm font-bold text-ink-700">
                      Qty
                      <input
                        type="number"
                        min={1}
                        value={snack.quantity}
                        onChange={(e) => updateSnack(snack.productId, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                        className="input w-16"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeSnack(snack.productId)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition hover:bg-red-50 hover:text-red-700"
                      aria-label={`Remove ${snack.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {form.snacks.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-mint-50 px-4 py-3 text-sm font-bold text-mint-900">
            <span className="flex items-center gap-2">
              <CircleDot className="h-4 w-4" />
              {packedCount} of {form.snacks.length} packed
            </span>
            <span>{totalItems} items total</span>
            <span>Est. cost {estCost.toFixed(2)}</span>
          </div>
        )}

        {saveError && <div className="mt-4"><ErrorNotice message={saveError} /></div>}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : editingId ? 'Save changes' : 'Save plan'}
          </button>
          {(editingId || form.snacks.length > 0 || form.event_name !== '') && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              <X className="h-4 w-4" /> Cancel
            </button>
          )}
        </div>
      </section>

      {showPicker && (
        <section className="card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold">Add snacks from the catalogue</h2>
            <button type="button" onClick={() => setShowPicker(false)} className="btn-secondary">
              <X className="h-4 w-4" /> Close
            </button>
          </div>
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={pickerQuery}
              onChange={(e) => setPickerQuery(e.target.value)}
              placeholder="Search by name or brand"
              className="input pl-10"
              autoFocus
            />
          </div>
          {productsLoading ? (
            <LoadingBlock label="Loading snacks..." />
          ) : pickerResults.length === 0 ? (
            <p className="mt-6 text-center text-sm text-ink-700">No snacks match your search.</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pickerResults.map((product) => (
                <div key={product.id} className="flex flex-col gap-3">
                  <ProductCard product={product} />
                  <button
                    type="button"
                    onClick={() => addSnack(product)}
                    className="btn-primary w-full justify-center"
                  >
                    <Plus className="h-4 w-4" /> Add to plan
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Your saved plans</h2>
        {plansLoading ? (
          <LoadingBlock label="Loading your plans..." />
        ) : plans.length === 0 ? (
          <EmptyState
            title="No plans yet"
            description="Create your first picnic snack plan above. It will appear here so you can reuse or update it."
          />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {plans.map((plan) => {
              const packed = plan.snacks.filter((s) => s.packed).length;
              const total = plan.snacks.length;
              const complete = total > 0 && packed === total;
              return (
                <li key={plan.id} className="card flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg font-semibold text-ink-900">{plan.event_name}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink-700">
                        {plan.event_date && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" /> {plan.event_date}
                          </span>
                        )}
                        <span>{plan.children_count} children</span>
                        <span>{total} snacks</span>
                      </p>
                      {plan.dietary_requirements.length > 0 && (
                        <p className="mt-1 text-xs font-semibold text-peach-700">
                          Avoiding: {plan.dietary_requirements.map(titleCase).join(', ')}
                        </p>
                      )}
                    </div>
                    {complete && (
                      <span className="flex items-center gap-1 rounded-full bg-mint-100 px-2.5 py-1 text-xs font-bold text-mint-800">
                        <Check className="h-3.5 w-3.5" /> Packed
                      </span>
                    )}
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-cream-100">
                    <div className="h-full bg-mint-500 transition-all" style={{ width: `${total ? (packed / total) * 100 : 0}%` }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => startEdit(plan)} className="btn-secondary flex-1 justify-center">
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(plan.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-ink-500 transition hover:bg-red-50 hover:text-red-700"
                      aria-label={`Delete ${plan.event_name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="rounded-2xl bg-sunny-100 px-4 py-3 text-sm text-ink-800">
        SnackMate shares general snack information to help you plan. Nutrition values depend on serving size. Products
        added by parents are not verified by SnackMate — always check the real pack label, especially for allergens.
        Consult a qualified healthcare professional for advice about your child's diet.
      </p>
    </div>
  );
}
