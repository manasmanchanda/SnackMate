import { useEffect, useState } from 'react';
import { ArrowLeft, Bookmark, BookmarkCheck, Pencil, Scale, Search, Clock } from 'lucide-react';
import { ProductThumb } from '@/components/ProductCard';
import { ErrorNotice, LoadingBlock, SignInPrompt, SourceBadge, EmptyState, VegBadge, VerificationBadge } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fetchProduct } from '@/lib/productApi';
import { NUTRITION_FIELDS, formatNumber, formatPrice, titleCase, type Product } from '@/lib/productModel';
import { navigate } from '@/lib/router';
import { rememberExplored } from '@/lib/recentlyExplored';
import { useSavedIds } from '@/lib/useSavedIds';

export function ProductDetailPage({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProduct(productId);
        if (!active) return;
        setProduct(data);
        if (data) rememberExplored(data.id);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Could not load this product.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [productId]);

  if (loading) return <LoadingBlock label="Loading product..." />;
  if (error) return <div className="mx-auto max-w-3xl px-4 py-10"><ErrorNotice message={error} /></div>;
  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Product not found" description="This snack may have been removed. Try searching the catalogue instead." action={<a href="#/explore" className="btn-primary">Explore snacks</a>} />
      </div>
    );
  }

  return <ProductDetail product={product} />;
}

function ProductDetail({ product }: { product: Product }) {
  const { user } = useAuth();
  const { savedIds, toggleSaved, error: saveError } = useSavedIds();
  const isOwner = user?.id === product.created_by && product.source === 'user_submitted';
  const saved = savedIds.has(product.id);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <button type="button" onClick={() => history.back()} className="inline-flex items-center gap-2 text-sm font-bold text-mint-800 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="card overflow-hidden">
          <ProductThumb product={product} className="aspect-square w-full" />
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-peach-50 px-3 py-1 text-xs font-bold text-peach-700">{product.category}</span>
            <SourceBadge source={product.source} />
            <VegBadge vegetarian={product.vegetarian} />
            <VerificationBadge status={product.verification_status} />
          </div>
          <div>
            <h1 className="text-4xl font-semibold">{product.name}</h1>
            {product.brand && <p className="mt-2 text-lg font-semibold text-ink-700">{product.brand}</p>}
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Fact label="Price" value={product.price !== null ? formatPrice(product.price) : 'Not provided'} />
            <Fact label="Package" value={product.package_quantity ?? 'Not provided'} />
            <Fact label="Serving" value={product.serving_size ?? 'Not provided'} />
          </dl>

          <div className="rounded-2xl border border-peach-200 bg-peach-50 p-4">
            <p className="font-bold text-peach-700">Allergens</p>
            <p className="mt-1 text-ink-900">
              {product.allergens.length ? product.allergens.map(titleCase).join(', ') : 'None listed. Always check the pack, as this may be incomplete.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {user ? (
              <button type="button" onClick={() => toggleSaved(product.id)} className={saved ? 'btn-primary' : 'btn-secondary'}>
                {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                {saved ? 'Saved to passport' : 'Save to passport'}
              </button>
            ) : null}
            <button type="button" onClick={() => navigate(`/compare?ids=${product.id}`)} className="btn-secondary">
              <Scale className="h-4 w-4" /> Compare
            </button>
            <button type="button" onClick={() => navigate(`/finder?original=${product.id}`)} className="btn-secondary">
              <Search className="h-4 w-4" /> Find look-alikes
            </button>
            {isOwner && (
              <button type="button" onClick={() => navigate(`/add-product?edit=${product.id}`)} className="btn-secondary">
                <Pencil className="h-4 w-4" /> Edit product
              </button>
            )}
          </div>
          {!user && <SignInPrompt message="Sign in to save this snack to your passport." />}
          {saveError && <ErrorNotice message={saveError} />}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <section className="card p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Nutrition per serving</h2>
          <p className="mt-1 text-sm text-ink-700">Values depend on serving size. "Not provided" means the value is not stored.</p>
          <table className="mt-5 w-full text-sm">
            <tbody>
              {NUTRITION_FIELDS.map((field) => (
                <tr key={field.key} className="border-b border-cream-200 last:border-0">
                  <th scope="row" className="py-3 text-left font-semibold text-ink-800">{field.label}</th>
                  <td className="py-3 text-right font-bold text-ink-900">{formatNumber(product[field.key], field.unit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="space-y-6">
          <div className="card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Ingredients</h2>
            <p className="mt-3 leading-relaxed text-ink-800">{product.ingredients ?? 'Not provided yet.'}</p>
          </div>

          {product.kind === 'homemade' && (
            <div className="card p-6 sm:p-8">
              <h2 className="text-2xl font-semibold">How to prepare</h2>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-mint-800">
                <Clock className="h-4 w-4" /> {product.prep_minutes ? `About ${product.prep_minutes} minutes` : 'Preparation time not provided'}
              </p>
              <p className="mt-3 leading-relaxed text-ink-800">{product.preparation ?? 'Preparation steps not provided yet.'}</p>
            </div>
          )}

          <div className="rounded-3xl bg-sunny-100 p-6 text-sm text-ink-800">
            <p className="font-bold">About this information</p>
            <p className="mt-2">
              {product.source === 'user_submitted'
                ? 'This product was added by a parent. SnackMate has not verified it, so check the pack label.'
                : product.source === 'catalogue'
                  ? 'This is a curated catalogue entry compiled from brand packaging and nutrition databases. Values are marked partially verified and may vary between batches. Always check the pack label.'
                  : 'This is a starter catalogue entry. Check the pack label before relying on any value.'}
            </p>
            {product.vegetarian && (
              <p className="mt-2">
                Veg/non-veg classification: {product.vegetarian === 'veg' ? 'Vegetarian' : 'Non-vegetarian'}. This is indicative — always confirm on the pack.
              </p>
            )}
            <p className="mt-2">Consult a qualified healthcare professional for advice about your child's condition or diet.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/80 p-4 shadow-soft">
      <dt className="text-xs font-bold uppercase tracking-wide text-ink-700">{label}</dt>
      <dd className="mt-1 font-bold text-ink-900">{value}</dd>
    </div>
  );
}
