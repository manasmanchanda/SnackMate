import { useEffect, useMemo, useState } from 'react';
import { Bookmark, BookmarkCheck, UserRound, RotateCcw } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState, ErrorNotice, LoadingBlock, PageHeader } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { EMPTY_FILTERS, filterProducts, type ExploreFilters, type QuickFilter } from '@/lib/filterProducts';
import { fetchChildProfile } from '@/lib/passportApi';
import { CATEGORIES, INGREDIENT_OPTIONS, TEXTURES, TASTES, ALLERGENS, titleCase, type Taste, type Texture } from '@/lib/productModel';
import { useRoute } from '@/lib/router';
import { useProducts } from '@/lib/useProducts';
import { useSavedIds } from '@/lib/useSavedIds';

const QUICK_FILTERS: Array<{ value: QuickFilter; label: string }> = [
  { value: 'all', label: 'All snacks' },
  { value: 'sweet', label: 'Sweet' },
  { value: 'salty', label: 'Salty' },
  { value: 'crunchy', label: 'Crunchy' },
  { value: 'soft', label: 'Soft' },
  { value: 'homemade', label: 'Homemade' },
  { value: 'school', label: 'School' },
  { value: 'quick', label: 'Quick' },
];

const QUICK_VALUES = QUICK_FILTERS.map((item) => item.value);

function parseOptionalNumber(raw: string): number | null {
  if (raw.trim() === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function ExplorePage() {
  const { params } = useRoute();
  const { user } = useAuth();
  const { products, loading, error } = useProducts();
  const { savedIds, toggleSaved, error: saveError } = useSavedIds();
  const requestedQuick = params.get('quick') as QuickFilter | null;
  const [filters, setFilters] = useState<ExploreFilters>({
    ...EMPTY_FILTERS,
    quick: requestedQuick && QUICK_VALUES.includes(requestedQuick) ? requestedQuick : 'all',
  });
  const [ingredientText, setIngredientText] = useState('');
  const [profileNote, setProfileNote] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      quick: requestedQuick && QUICK_VALUES.includes(requestedQuick) ? requestedQuick : 'all',
    }));
  }, [requestedQuick]);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      ingredientsToAvoid: ingredientText.split(',').map((item) => item.trim()).filter(Boolean),
    }));
  }, [ingredientText]);

  const results = useMemo(() => filterProducts(products, filters), [products, filters]);

  const update = <K extends keyof ExploreFilters>(key: K, value: ExploreFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const toggleAllergen = (allergen: string) =>
    update(
      'allergensToAvoid',
      filters.allergensToAvoid.includes(allergen)
        ? filters.allergensToAvoid.filter((item) => item !== allergen)
        : [...filters.allergensToAvoid, allergen],
    );

  const applyChildProfile = async () => {
    setProfileError(null);
    setProfileNote(null);
    try {
      const profile = await fetchChildProfile();
      if (!profile) {
        setProfileNote('You have not created a child profile yet. Create one on the Profile page first.');
        return;
      }
      setFilters((current) => ({
        ...current,
        allergensToAvoid: profile.food_allergies,
        maxPrice: profile.max_budget,
        texture: (profile.preferred_textures.length === 1 ? profile.preferred_textures[0] : '') as Texture | '',
      }));
      setIngredientText(profile.disliked_ingredients.join(', '));
      setProfileNote('Your child profile has been applied. Allergies, budget, texture and ingredients to avoid are now set.');
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Could not load your child profile.');
    }
  };

  const resetFilters = () => {
    setIngredientText('');
    setProfileNote(null);
    setFilters(EMPTY_FILTERS);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Explore snacks"
        title="Discover snack ideas"
        description="Browse by taste, texture or occasion, then narrow the list with filters. Missing information is shown as Not provided and is never assumed."
      />

      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Quick categories">
        {QUICK_FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={filters.quick === item.value}
            onClick={() => update('quick', item.value)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
              filters.quick === item.value ? 'border-mint-700 bg-mint-700 text-white shadow-soft' : 'border-cream-200 bg-white text-ink-800 hover:border-mint-500'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="card h-fit space-y-5 p-6 lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1 text-sm font-bold text-mint-800 hover:underline">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>

          {user && (
            <div className="space-y-2 rounded-2xl bg-sunny-100 p-4">
              <button type="button" onClick={applyChildProfile} className="btn-secondary w-full">
                <UserRound className="h-4 w-4" /> Use my child's profile
              </button>
              {profileNote && <p className="text-sm text-ink-800">{profileNote}</p>}
              {profileError && <ErrorNotice message={profileError} />}
            </div>
          )}

          <div>
            <label className="label" htmlFor="ex-search">Search name or brand</label>
            <input id="ex-search" className="input" value={filters.search} onChange={(e) => update('search', e.target.value)} placeholder="e.g. puffs" />
          </div>
          <div>
            <label className="label" htmlFor="ex-category">Category</label>
            <select id="ex-category" className="input" value={filters.category} onChange={(e) => update('category', e.target.value)}>
              <option value="">All categories</option>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="ex-taste">Taste</label>
              <select id="ex-taste" className="input" value={filters.taste} onChange={(e) => update('taste', e.target.value as Taste | '')}>
                <option value="">Any</option>
                {TASTES.map((taste) => <option key={taste} value={taste}>{titleCase(taste)}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="ex-texture">Texture</label>
              <select id="ex-texture" className="input" value={filters.texture} onChange={(e) => update('texture', e.target.value as Texture | '')}>
                <option value="">Any</option>
                {TEXTURES.map((texture) => <option key={texture} value={texture}>{titleCase(texture)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberFilter id="ex-price" label="Max price" value={filters.maxPrice} onChange={(v) => update('maxPrice', v)} />
            <NumberFilter id="ex-prep" label="Max prep (min)" value={filters.maxPrepMinutes} onChange={(v) => update('maxPrepMinutes', v)} />
            <NumberFilter id="ex-sugar" label="Max sugar (g)" value={filters.maxSugar} onChange={(v) => update('maxSugar', v)} />
            <NumberFilter id="ex-sodium" label="Max sodium (mg)" value={filters.maxSodium} onChange={(v) => update('maxSodium', v)} />
          </div>
          <p className="text-xs text-ink-700">Snacks without a value for a limit you set are hidden.</p>

          <fieldset>
            <legend className="label">Allergens to avoid</legend>
            <div className="flex flex-wrap gap-2">
              {ALLERGENS.map((allergen) => {
                const active = filters.allergensToAvoid.includes(allergen);
                return (
                  <button key={allergen} type="button" aria-pressed={active} onClick={() => toggleAllergen(allergen)} className={`rounded-full border px-3 py-1 text-xs font-bold transition ${active ? 'border-peach-500 bg-peach-100 text-peach-700' : 'border-cream-200 bg-white text-ink-800'}`}>
                    {titleCase(allergen)}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label className="label" htmlFor="ex-avoid">Ingredients to avoid</label>
            <input id="ex-avoid" className="input" list="avoid-options" value={ingredientText} onChange={(e) => setIngredientText(e.target.value)} placeholder="e.g. palm oil, msg" />
            <datalist id="avoid-options">
              {INGREDIENT_OPTIONS.map((option) => <option key={option} value={option} />)}
            </datalist>
            <p className="mt-1 text-xs text-ink-700">Separate several ingredients with commas.</p>
          </div>
        </aside>

        <section className="space-y-6">
          <p className="text-sm font-bold text-ink-800" aria-live="polite">{loading ? 'Loading snacks...' : `${results.length} snack${results.length === 1 ? '' : 's'} found`}</p>
          {error && <ErrorNotice message={`We could not load snacks: ${error}`} />}
          {saveError && <ErrorNotice message={saveError} />}
          {loading ? (
            <LoadingBlock label="Loading snacks..." />
          ) : results.length === 0 ? (
            <EmptyState title="No snacks match these filters" description="Try loosening one of the limits, or reset the filters to see every snack." action={<button type="button" onClick={resetFilters} className="btn-primary">Reset filters</button>} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
              {results.map((product) => {
                const saved = savedIds.has(product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    footer={
                      <button
                        type="button"
                        onClick={() => toggleSaved(product.id)}
                        aria-label={saved ? 'Remove from passport' : 'Save to passport'}
                        className="btn-secondary px-3 py-2 text-sm"
                        disabled={!user}
                        title={user ? undefined : 'Sign in to save snacks'}
                      >
                        {saved ? <BookmarkCheck className="h-4 w-4 text-mint-700" /> : <Bookmark className="h-4 w-4" />}
                        {saved ? 'Saved' : 'Save'}
                      </button>
                    }
                  />
                );
              })}
            </div>
          )}
          {!user && !loading && (
            <p className="text-sm text-ink-700">
              <a href="#/profile" className="font-bold text-mint-800 hover:underline">Sign in</a> to save snacks to your passport.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function NumberFilter({ id, label, value, onChange }: { id: string; label: string; value: number | null; onChange: (value: number | null) => void }) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} type="number" min="0" step="any" inputMode="decimal" className="input" value={value ?? ''} onChange={(e) => onChange(parseOptionalNumber(e.target.value))} />
    </div>
  );
}
