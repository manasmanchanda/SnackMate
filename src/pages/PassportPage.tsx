import { useEffect, useMemo, useState } from 'react';
import { Scale, Trash2, Save, ExternalLink } from 'lucide-react';
import { ProductThumb } from '@/components/ProductCard';
import { ErrorNotice, LoadingBlock, PageHeader, SignInPrompt, EmptyState, SourceBadge } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fetchSavedSnacks, removeSavedSnack, updateSavedSnack, type SavedSnack, type SavedStatus } from '@/lib/passportApi';
import { navigate } from '@/lib/router';
import { readRecentlyExplored } from '@/lib/recentlyExplored';
import { useProducts } from '@/lib/useProducts';

const TABS: Array<{ value: 'all' | SavedStatus; label: string }> = [
  { value: 'all', label: 'All saved' },
  { value: 'favourite', label: 'Favourites' },
  { value: 'evaluated', label: 'Evaluated' },
  { value: 'alternative', label: 'Preferred alternatives' },
];

const STATUS_LABEL: Record<SavedStatus, string> = {
  favourite: 'Favourite',
  evaluated: 'Evaluated',
  alternative: 'Preferred alternative',
};

export function PassportPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<SavedSnack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | SavedStatus>('all');
  const { products } = useProducts();
  const [recentIds] = useState(() => readRecentlyExplored());

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchSavedSnacks());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your passport.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      await loadItems();
    })();
  }, [user]);

  const visible = useMemo(() => items.filter((item) => tab === 'all' || item.status === tab), [items, tab]);
  const recent = useMemo(() => recentIds.map((id) => products.find((p) => p.id === id)).filter((p) => p !== undefined), [recentIds, products]);

  if (authLoading) return <LoadingBlock label="Checking your account..." />;

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
        <PageHeader eyebrow="Parent's snack passport" title="Your personal snack notebook" />
        <SignInPrompt message="Sign in to save favourite snacks, add notes and keep a list of preferred alternatives." />
      </div>
    );
  }

  const remove = async (id: string) => {
    setError(null);
    try {
      await removeSavedSnack(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove this snack.');
    }
  };

  const compareVisible = () => {
    const ids = visible.map((item) => item.product_id).slice(0, 4);
    navigate(`/compare${ids.length ? `?ids=${ids.join(',')}` : ''}`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Parent's snack passport"
        title="Your saved snacks"
        description="Keep favourites, products you have evaluated and the alternatives you prefer. Add private notes to remember what worked."
        action={
          visible.length >= 2 ? (
            <button type="button" onClick={compareVisible} className="btn-primary">
              <Scale className="h-4 w-4" /> Compare these {Math.min(visible.length, 4)}
            </button>
          ) : null
        }
      />

      {error && <ErrorNotice message={error} />}

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
        {TABS.map((option) => {
          const count = option.value === 'all' ? items.length : items.filter((item) => item.status === option.value).length;
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={tab === option.value}
              onClick={() => setTab(option.value)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
                tab === option.value ? 'border-mint-700 bg-mint-700 text-white' : 'border-cream-200 bg-white text-ink-800 hover:border-mint-500'
              }`}
            >
              {option.label} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <LoadingBlock label="Loading your passport..." />
      ) : visible.length === 0 ? (
        <EmptyState
          title={items.length === 0 ? 'Your passport is empty' : 'Nothing in this list yet'}
          description="Save snacks from the Explore or Look-Alikes pages to start your passport."
          action={<a href="#/explore" className="btn-primary">Explore snacks</a>}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {visible.map((item) => (
            <SavedCard key={item.id} item={item} onRemove={() => remove(item.id)} onChanged={loadItems} onError={setError} />
          ))}
        </div>
      )}

      {recent.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Recently explored</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((product) => (
              <li key={product.id}>
                <a href={`#/product/${product.id}`} className="card flex items-center gap-4 p-3 transition hover:-translate-y-0.5">
                  <ProductThumb product={product} className="h-14 w-14 shrink-0 rounded-xl" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-ink-900">{product.name}</span>
                    <span className="block truncate text-xs text-ink-700">{product.brand ?? 'Brand not provided'}</span>
                  </span>
                  <ExternalLink className="h-4 w-4 text-mint-700" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function SavedCard({ item, onRemove, onChanged, onError }: { item: SavedSnack; onRemove: () => void; onChanged: () => void; onError: (message: string) => void }) {
  const product = item.products;
  const [note, setNote] = useState(item.note ?? '');
  const [saving, setSaving] = useState(false);
  const noteChanged = note !== (item.note ?? '');

  const changeStatus = async (status: SavedStatus) => {
    setSaving(true);
    try {
      await updateSavedSnack(item.id, { status, note: note.trim() || null });
      onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not update this snack.');
    } finally {
      setSaving(false);
    }
  };

  const saveNote = async () => {
    setSaving(true);
    try {
      await updateSavedSnack(item.id, { status: item.status, note: note.trim() || null });
      onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not save your note.');
    } finally {
      setSaving(false);
    }
  };

  if (!product) return null;

  return (
    <article className="card flex flex-col gap-4 p-5">
      <div className="flex gap-4">
        <ProductThumb product={product} className="h-24 w-24 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <a href={`#/product/${product.id}`} className="font-display text-xl font-semibold text-ink-900 hover:text-mint-800">{product.name}</a>
          <p className="text-sm text-ink-700">{product.brand ?? 'Brand not provided'}</p>
          <SourceBadge source={product.source} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label className="label" htmlFor={`status-${item.id}`}>Status</label>
          <select id={`status-${item.id}`} className="input" value={item.status} disabled={saving} onChange={(e) => changeStatus(e.target.value as SavedStatus)}>
            {(Object.keys(STATUS_LABEL) as SavedStatus[]).map((status) => (
              <option key={status} value={status}>{STATUS_LABEL[status]}</option>
            ))}
          </select>
        </div>
        <button type="button" onClick={onRemove} className="btn-danger">
          <Trash2 className="h-4 w-4" /> Remove
        </button>
      </div>

      <div>
        <label className="label" htmlFor={`note-${item.id}`}>Personal note</label>
        <textarea id={`note-${item.id}`} rows={2} className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Child liked this at the school fair" />
        {noteChanged && (
          <div className="mt-2 flex justify-end">
            <button type="button" onClick={saveNote} disabled={saving} className="btn-primary px-4 py-2 text-sm">
              <Save className="h-4 w-4" /> Save note
            </button>
          </div>
        )}
      </div>

      <div className="mt-auto flex justify-between gap-3 border-t border-cream-200 pt-3 text-sm">
        <span className="text-ink-700">{STATUS_LABEL[item.status]}</span>
        <button type="button" onClick={() => navigate(`/compare?ids=${product.id}`)} className="font-bold text-mint-800 hover:underline">
          Compare with others
        </button>
      </div>
    </article>
  );
}
