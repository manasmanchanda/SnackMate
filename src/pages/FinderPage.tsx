import { useMemo, useState, type FormEvent } from 'react';
import { Bookmark, BookmarkCheck, Scale, Search } from 'lucide-react';
import { ProductCard, ProductThumb } from '@/components/ProductCard';
import { SimilarityMeter } from '@/components/SimilarityMeter';
import { EmptyState, ErrorNotice, LoadingBlock, PageHeader, SourceBadge } from '@/components/ui';
import { navigate, useRoute } from '@/lib/router';
import { useProducts } from '@/lib/useProducts';
import { useSavedIds } from '@/lib/useSavedIds';
import { formatNumber, formatPrice, titleCase, type Product } from '@/lib/productModel';
import { describeDifferences, findAlternatives } from '@/lib/similarity';
import { searchWithFallback } from '@/lib/fuzzySearch';

const MAX_COMPARE = 4;

export function FinderPage() {
  const { params } = useRoute();
  const { products, loading, error } = useProducts();
  const originalId = params.get('original');
  const initialQuery = params.get('q') ?? '';

  const original = originalId ? products.find((p) => p.id === originalId) ?? null : null;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Look-alike finder"
        title={original ? `Snacks like ${original.name}` : 'Find a look-alike snack'}
        description="Search for your child's favourite snack. We compare taste, texture, flavour and nutrition to suggest alternatives. Scores are estimates from the information stored, not a judgement of suitability."
      />
      {error && <ErrorNotice message={`We could not load snacks: ${error}`} />}
      {loading ? (
        <LoadingBlock label="Loading snacks..." />
      ) : original ? (
        <Results original={original} products={products} />
      ) : (
        <SearchStep products={products} initialQuery={initialQuery} />
      )}
    </div>
  );
}

function SearchStep({ products, initialQuery }: { products: Product[]; initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [submitted, setSubmitted] = useState(initialQuery);

  const { results, exactMatch, isCloseMatch } = useMemo(
    () => searchWithFallback(products, submitted, 12),
    [products, submitted],
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(query);
    navigate(`/finder?q=${encodeURIComponent(query.trim())}`);
  };

  const showNoResults = submitted.trim() !== '' && results.length === 0;
  const showCloseMatchLabel = isCloseMatch && !exactMatch && results.length > 0;

  return (
    <div className="space-y-8">
      <form onSubmit={submit} role="search" className="card flex flex-col gap-3 p-4 sm:flex-row">
        <label htmlFor="finder-search" className="sr-only">Snack name, brand or description</label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-700/60" />
          <input id="finder-search" className="input pl-12" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a snack name, brand or flavour, e.g. cheesy puffs, choco chip" />
        </div>
        <button type="submit" className="btn-primary">Search snacks</button>
      </form>

      {showCloseMatchLabel && (
        <div className="flex items-center gap-2 rounded-2xl border border-sunny-200 bg-sunny-50 px-4 py-3 text-sm font-semibold text-ink-800" role="status">
          <Search className="h-4 w-4 shrink-0 text-peach-500" />
          <span>Showing closest matches for "{submitted.trim()}"</span>
        </div>
      )}

      {results.length > 0 && (
        <p className="text-sm font-bold text-ink-800" aria-live="polite">
          {results.length} snack{results.length === 1 ? '' : 's'} found{exactMatch ? '' : ' by relevance'}
        </p>
      )}

      {showNoResults ? (
        <EmptyState
          title="No snack matches that search"
          description="We could not find anything close to that. Try a different word, or add the snack yourself so other parents can find it."
          action={<a href="#/add-product" className="btn-primary">Add your product</a>}
        />
      ) : results.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {results.map(({ product, score }) => (
            <div key={product.id} className="relative">
              <div className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-xs font-extrabold text-mint-800 shadow-soft">
                {score}% match
              </div>
              <ProductCard
                product={product}
                footer={<a href={`#/finder?original=${product.id}`} className="btn-primary px-4 py-2 text-sm">Find look-alikes</a>}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Results({ original, products }: { original: Product; products: Product[] }) {
  const alternatives = useMemo(() => findAlternatives(original, products), [original, products]);
  const { savedIds, toggleSaved, error: saveError } = useSavedIds();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCompare = (id: string) =>
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= MAX_COMPARE - 1) return current;
      return [...current, id];
    });

  const compareSelected = () => {
    navigate(`/compare?ids=${[original.id, ...selected].join(',')}`);
  };

  return (
    <div className="space-y-10">
      <a href="#/finder" className="text-sm font-bold text-mint-800 hover:underline">Search for a different snack</a>

      <div className="card grid gap-6 p-6 md:grid-cols-[220px_1fr] md:p-8">
        <ProductThumb product={original} className="aspect-square w-full rounded-3xl" />
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-peach-50 px-3 py-1 text-xs font-bold text-peach-700">Your child's snack</span>
            <SourceBadge source={original.source} />
          </div>
          <h2 className="text-3xl font-semibold">{original.name}</h2>
          {original.brand && <p className="font-semibold text-ink-700">{original.brand}</p>}
          <p className="text-sm text-ink-700">
            <span className="font-bold text-ink-900">Ingredients:</span> {original.ingredients ?? 'Not provided'}
          </p>
          <p className="text-sm text-ink-700">
            <span className="font-bold text-ink-900">Allergens:</span> {original.allergens.length ? original.allergens.map(titleCase).join(', ') : 'None listed'}
          </p>
          <p className="text-sm text-ink-700">
            Sugar {formatNumber(original.sugar, 'g')} - Sodium {formatNumber(original.sodium_mg, 'mg')} - Price {formatPrice(original.price)}
          </p>
          <a href={`#/product/${original.id}`} className="btn-secondary">View full details</a>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Similar alternatives</h2>
          <p className="text-sm text-ink-700">Tick up to {MAX_COMPARE - 1} to compare them with your child's snack.</p>
        </div>
        <button type="button" onClick={compareSelected} disabled={selected.length === 0} className="btn-primary">
          <Scale className="h-4 w-4" /> Compare {selected.length > 0 ? `(${selected.length + 1})` : ''}
        </button>
      </div>

      {saveError && <ErrorNotice message={saveError} />}

      {alternatives.length === 0 ? (
        <EmptyState title="No alternatives yet" description="There are no other snacks in this group. Add more products to widen the search." action={<a href="#/add-product" className="btn-primary">Add a product</a>} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {alternatives.map(({ product, scores }) => {
            const isSelected = selected.includes(product.id);
            const newAllergens = product.allergens.filter((a) => !original.allergens.includes(a));
            const differences = describeDifferences(original, product);
            return (
              <article key={product.id} className="card flex flex-col gap-4 p-5">
                <div className="flex gap-4">
                  <ProductThumb product={product} className="h-24 w-24 shrink-0 rounded-2xl" />
                  <div className="min-w-0">
                    <a href={`#/product/${product.id}`} className="font-display text-lg font-semibold text-ink-900 hover:text-mint-800">{product.name}</a>
                    {product.brand && <p className="text-sm text-ink-700">{product.brand}</p>}
                    <div className="mt-2"><SourceBadge source={product.source} /></div>
                  </div>
                </div>

                <div className="rounded-2xl bg-mint-50 px-4 py-3">
                  <p className="text-sm font-bold text-mint-900">Overall look-alike score: {scores.overall}%</p>
                </div>
                <div className="space-y-3">
                  <SimilarityMeter label="Taste similarity" value={scores.taste} />
                  <SimilarityMeter label="Texture similarity" value={scores.texture} />
                  <SimilarityMeter label="Flavour similarity" value={scores.flavour} />
                  <SimilarityMeter label="Nutrition closeness" value={scores.nutrition} />
                </div>

                <div className="text-sm text-ink-700">
                  <p className="font-bold text-ink-900">Key differences</p>
                  {differences.length ? (
                    <ul className="mt-1 list-disc pl-5">
                      {differences.slice(0, 3).map((line) => <li key={line}>{line}</li>)}
                    </ul>
                  ) : (
                    <p className="mt-1">No large nutrition differences found from the stored values.</p>
                  )}
                  {newAllergens.length > 0 && (
                    <p className="mt-2 font-bold text-peach-700">Contains allergens not in your snack: {newAllergens.map(titleCase).join(', ')}</p>
                  )}
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-4">
                  <span className="text-sm font-bold text-ink-800">{product.price !== null ? `Price ${formatPrice(product.price)}` : 'Price not provided'}</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => toggleCompare(product.id)} aria-pressed={isSelected} className={isSelected ? 'btn-primary px-4 py-2 text-sm' : 'btn-secondary px-4 py-2 text-sm'}>
                      <Scale className="h-4 w-4" /> {isSelected ? 'Selected' : 'Compare'}
                    </button>
                    <button type="button" onClick={() => toggleSaved(product.id)} aria-label={savedIds.has(product.id) ? 'Remove from passport' : 'Save to passport'} className="btn-secondary px-3 py-2 text-sm">
                      {savedIds.has(product.id) ? <BookmarkCheck className="h-4 w-4 text-mint-700" /> : <Bookmark className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
