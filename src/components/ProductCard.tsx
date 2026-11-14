import { useState, type ReactNode } from 'react';
import { ImageOff } from 'lucide-react';
import { SourceBadge, VegBadge } from '@/components/ui';
import { formatNumber, formatPrice, titleCase, type Product } from '@/lib/productModel';

export function ProductThumb({ product, className = '' }: { product: Product; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!product.image_url || failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-sunny-100 to-mint-100 text-mint-800 ${className}`}>
        <ImageOff className="h-8 w-8 opacity-60" aria-hidden="true" />
        <span className="sr-only">No photo available</span>
      </div>
    );
  }

  return (
    <img
      src={product.image_url}
      alt={product.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

export function ProductCard({ product, footer }: { product: Product; footer?: ReactNode }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <a href={`#/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden">
        <ProductThumb product={product} className="h-full w-full transition duration-500 group-hover:scale-105" />
      </a>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-peach-50 px-2.5 py-1 text-xs font-bold text-peach-700">{product.category}</span>
          <SourceBadge source={product.source} />
          <VegBadge vegetarian={product.vegetarian} />
        </div>
        <div>
          <a href={`#/product/${product.id}`} className="font-display text-xl font-semibold text-ink-900 hover:text-mint-800">
            {product.name}
          </a>
          {product.brand && <p className="text-sm font-semibold text-ink-700">{product.brand}</p>}
        </div>
        <dl className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Calories" value={formatNumber(product.calories)} />
          <Stat label="Sugar" value={formatNumber(product.sugar, 'g')} />
          <Stat label="Sodium" value={formatNumber(product.sodium_mg, 'mg')} />
        </dl>
        {product.allergens.length > 0 && (
          <p className="text-xs font-semibold text-peach-700">Allergens: {product.allergens.map(titleCase).join(', ')}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-sm font-bold text-ink-800">{product.price !== null ? `Price ${formatPrice(product.price)}` : 'Price not provided'}</span>
          {footer}
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-cream-100 px-2 py-2">
      <dt className="text-[11px] font-bold uppercase tracking-wide text-ink-700">{label}</dt>
      <dd className="text-sm font-bold text-ink-900">{value}</dd>
    </div>
  );
}
