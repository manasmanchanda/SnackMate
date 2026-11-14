import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { ProductThumb } from '@/components/ProductCard';
import { EmptyState, ErrorNotice, LoadingBlock, PageHeader, SourceBadge } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fetchChildProfile, type ChildProfile } from '@/lib/passportApi';
import { NUTRITION_FIELDS, formatNumber, formatPrice, ingredientsContain, titleCase, type NutritionKey, type Product } from '@/lib/productModel';
import { navigate, useRoute } from '@/lib/router';
import { useProducts } from '@/lib/useProducts';

const MAX_COMPARE = 4;

function bestFor(products: Product[], key: NutritionKey | 'price', preferred: 'lower' | 'higher'): string[] {
  const values = products.map((p) => p[key]).filter((value): value is number => typeof value === 'number');
  if (values.length < 2) return [];
  if (values.every((value) => value === values[0])) return [];
  const target = preferred === 'lower' ? Math.min(...values) : Math.max(...values);
  return products.filter((p) => p[key] === target).map((p) => p.id);
}

export function ComparePage() {
  const { params } = useRoute();
  const { products, loading, error } = useProducts();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [pickerQuery, setPickerQuery] = useState('');

  const ids = (params.get('ids') ?? '').split(',').filter(Boolean).slice(0, MAX_COMPARE);
  const selected = ids.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => p !== undefined);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    (async () => {
      try {
        setProfile(await fetchChildProfile());
      } catch {
        setProfile(null);
      }
    })();
  }, [user]);

  const setIds = (next: string[]) => navigate(`/compare${next.length ? `?ids=${next.join(',')}` : ''}`);

  const toggle = (id: string) => {
    if (ids.includes(id)) {
      setIds(ids.filter((item) => item !== id));
    } else if (ids.length < MAX_COMPARE) {
      setIds([...ids, id]);
    }
  };

  const pickable = useMemo(() => {
    const needle = pickerQuery.trim().toLowerCase();
    return products.filter((p) => p.kind === 'packaged' && (!needle || `${p.name} ${p.brand ?? ''}`.toLowerCase().includes(needle)));
  }, [products, pickerQuery]);

  const summary = useMemo(() => buildSummary(selected), [selected]);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Snack comparison studio"
        title="Compare snacks side by side"
        description={`Pick between two and ${MAX_COMPARE} packaged snacks. The best value in each row is highlighted. Values depend on serving size, so check the pack.`}
      />
      {error && <ErrorNotice message={`We could not load snacks: ${error}`} />}

      <section className="card space-y-5 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Choose snacks ({ids.length}/{MAX_COMPARE})</h2>
          <div className="flex gap-2">
            <label htmlFor="picker" className="sr-only">Search snacks to compare</label>
            <input id="picker" className="input sm:w-72" value={pickerQuery} onChange={(e) => setPickerQuery(e.target.value)} placeholder="Search by name or brand" />
            {ids.length > 0 && (
              <button type="button" onClick={() => setIds([])} className="btn-secondary shrink-0">Clear</button>
            )}
          </div>
        </div>
        {loading ? (
          <LoadingBlock label="Loading snacks..." />
        ) : (
          <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
            {pickable.map((product) => {
              const active = ids.includes(product.id);
              const disabled = !active && ids.length >= MAX_COMPARE;
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggle(product.id)}
                  disabled={disabled}
                  aria-pressed={active}
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition disabled:opacity-50 ${
                    active ? 'border-mint-700 bg-mint-50' : 'border-cream-200 bg-white hover:border-mint-500'
                  }`}
                >
                  <ProductThumb product={product} className="h-12 w-12 shrink-0 rounded-xl" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-ink-900">{product.name}</span>
                    <span className="block truncate text-xs text-ink-700">{product.brand ?? 'Brand not provided'}</span>
                  </span>
                  {active && <Check className="h-5 w-5 shrink-0 text-mint-700" />}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {selected.length < 2 ? (
        <EmptyState
          title="Choose at least two snacks"
          description="Select two or more snacks above to see their nutrition side by side. You can also start from the Look-Alike Finder or a product page."
          action={<a href="#/finder" className="btn-primary">Open the look-alike finder</a>}
        />
      ) : (
        <>
          <ComparisonTable products={selected} onRemove={(id) => setIds(ids.filter((item) => item !== id))} profile={profile} />
          <section className="card space-y-4 p-6 md:p-8">
            <h2 className="text-2xl font-semibold">Comparison summary</h2>
            {summary.length > 0 ? (
              <ul className="grid gap-3 md:grid-cols-2">
                {summary.map((line) => (
                  <li key={line} className="rounded-2xl bg-cream-100 px-4 py-3 text-sm font-semibold text-ink-800">{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-ink-700">The selected snacks have similar values, or some numbers are not provided.</p>
            )}
            <p className="text-sm text-ink-700">
              This summary only reflects the numbers stored for these snacks. It does not show which snack suits your child best. Consult a qualified healthcare professional for advice about your child's condition.
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function buildSummary(products: Product[]): string[] {
  const lines: string[] = [];
  for (const field of NUTRITION_FIELDS) {
    const winners = bestFor(products, field.key, field.preferred);
    if (winners.length !== 1) continue;
    const winner = products.find((p) => p.id === winners[0]);
    if (!winner) continue;
    const verb = field.preferred === 'lower' ? 'Lowest' : 'Highest';
    lines.push(`${verb} ${field.label.toLowerCase()}: ${winner.name} (${formatNumber(winner[field.key], field.unit)})`);
  }
  const priced = products.filter((p) => p.price !== null);
  if (priced.length >= 2) {
    const cheapest = priced.reduce((a, b) => ((a.price ?? 0) <= (b.price ?? 0) ? a : b));
    lines.push(`Lowest price: ${cheapest.name} (${formatPrice(cheapest.price)})`);
  }
  return lines;
}

function ComparisonTable({ products, onRemove, profile }: { products: Product[]; onRemove: (id: string) => void; profile: ChildProfile | null }) {
  const priceWinners = bestFor(products, 'price', 'lower');
  const allergenWarnings = (product: Product) => {
    if (!profile) return [];
    return profile.food_allergies.filter((allergen) => product.allergens.includes(allergen));
  };
  const avoidWarnings = (product: Product) => (profile ? profile.disliked_ingredients.filter((term) => ingredientsContain(product, term)) : []);

  return (
    <section className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">Nutrition comparison of selected snacks</caption>
          <thead>
            <tr className="border-b border-cream-200 bg-cream-100">
              <th scope="col" className="sticky left-0 z-10 w-48 bg-cream-100 p-4 font-bold text-ink-900">Snack</th>
              {products.map((product) => (
                <th key={product.id} scope="col" className="min-w-[200px] p-4 align-top">
                  <div className="flex flex-col items-start gap-3">
                    <ProductThumb product={product} className="h-24 w-full rounded-2xl" />
                    <a href={`#/product/${product.id}`} className="font-display text-lg font-semibold text-ink-900 hover:text-mint-800">{product.name}</a>
                    <span className="text-xs font-semibold text-ink-700">{product.brand ?? 'Brand not provided'}</span>
                    <SourceBadge source={product.source} />
                    <button type="button" onClick={() => onRemove(product.id)} className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:underline">
                      <X className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-cream-200">
              <th scope="row" className="sticky left-0 bg-white p-4 font-bold">Ingredients</th>
              {products.map((product) => <td key={product.id} className="p-4 text-ink-700">{product.ingredients ?? 'Not provided'}</td>)}
            </tr>
            <tr className="border-b border-cream-200">
              <th scope="row" className="sticky left-0 bg-white p-4 font-bold">Allergens</th>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  {product.allergens.length ? product.allergens.map(titleCase).join(', ') : 'None listed'}
                  {allergenWarnings(product).length > 0 && (
                    <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-800">
                      <AlertTriangle className="h-3.5 w-3.5" /> On your child's allergy list: {allergenWarnings(product).map(titleCase).join(', ')}
                    </p>
                  )}
                  {avoidWarnings(product).length > 0 && (
                    <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-peach-50 px-2.5 py-1 text-xs font-bold text-peach-700">
                      <AlertTriangle className="h-3.5 w-3.5" /> Contains an ingredient to avoid: {avoidWarnings(product).join(', ')}
                    </p>
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-cream-200">
              <th scope="row" className="sticky left-0 bg-white p-4 font-bold">Serving size</th>
              {products.map((product) => <td key={product.id} className="p-4">{product.serving_size ?? 'Not provided'}</td>)}
            </tr>
            <tr className="border-b border-cream-200">
              <th scope="row" className="sticky left-0 bg-white p-4 font-bold">Package size</th>
              {products.map((product) => <td key={product.id} className="p-4">{product.package_quantity ?? 'Not provided'}</td>)}
            </tr>
            {NUTRITION_FIELDS.map((field) => {
              const winners = bestFor(products, field.key, field.preferred);
              const maxValue = Math.max(...products.map((p) => p[field.key] ?? 0), 1);
              return (
                <tr key={field.key} className="border-b border-cream-200">
                  <th scope="row" className="sticky left-0 bg-white p-4 font-bold">{field.label}<span className="block text-xs font-semibold text-ink-700">{field.unit}</span></th>
                  {products.map((product) => {
                    const value = product[field.key];
                    const isWinner = winners.includes(product.id);
                    return (
                      <td key={product.id} className={`p-4 ${isWinner ? 'bg-mint-50' : ''}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-ink-900">{formatNumber(value)}</span>
                          {isWinner && <span className="rounded-full bg-mint-700 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">{field.preferred === 'lower' ? 'Lowest' : 'Highest'}</span>}
                        </div>
                        {value !== null && (
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream-200" aria-hidden="true">
                            <div className={`h-full rounded-full ${isWinner ? 'bg-mint-500' : 'bg-peach-200'}`} style={{ width: `${(value / maxValue) * 100}%` }} />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr>
              <th scope="row" className="sticky left-0 bg-white p-4 font-bold">Price</th>
              {products.map((product) => (
                <td key={product.id} className={`p-4 ${priceWinners.includes(product.id) ? 'bg-mint-50' : ''}`}>
                  <span className="font-bold text-ink-900">{product.price !== null ? formatPrice(product.price) : 'Not provided'}</span>
                  {priceWinners.includes(product.id) && <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-mint-800"><Check className="h-3.5 w-3.5" /> Lowest price</span>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="border-t border-cream-200 bg-cream-100 px-6 py-3 text-xs text-ink-700">
        Highlighted cells show the lowest or highest value in each row, so they do not mean a snack is safe or suitable. "Not provided" means the value is not stored.
      </p>
    </section>
  );
}
