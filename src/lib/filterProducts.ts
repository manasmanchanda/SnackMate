import { ingredientsContain, type Product, type Taste, type Texture } from '@/lib/productModel';

export type QuickFilter = 'all' | Taste | Texture | 'homemade' | 'school' | 'quick';

export type ExploreFilters = {
  search: string;
  category: string;
  quick: QuickFilter;
  taste: Taste | '';
  texture: Texture | '';
  maxPrice: number | null;
  maxSugar: number | null;
  maxSodium: number | null;
  maxPrepMinutes: number | null;
  allergensToAvoid: string[];
  ingredientsToAvoid: string[];
};

export const EMPTY_FILTERS: ExploreFilters = {
  search: '',
  category: '',
  quick: 'all',
  taste: '',
  texture: '',
  maxPrice: null,
  maxSugar: null,
  maxSodium: null,
  maxPrepMinutes: null,
  allergensToAvoid: [],
  ingredientsToAvoid: [],
};

function matchesQuick(product: Product, quick: QuickFilter): boolean {
  switch (quick) {
    case 'all':
      return true;
    case 'homemade':
      return product.kind === 'homemade';
    case 'school':
    case 'quick':
      return product.tags.includes(quick);
    case 'sweet':
    case 'salty':
    case 'savoury':
    case 'sour':
    case 'mild':
      return product.taste === quick;
    case 'crunchy':
    case 'soft':
    case 'chewy':
    case 'creamy':
      return product.texture === quick;
  }
}

export function filterProducts(products: Product[], filters: ExploreFilters): Product[] {
  const search = filters.search.trim().toLowerCase();

  return products.filter((product) => {
    if (search && !`${product.name} ${product.brand ?? ''}`.toLowerCase().includes(search)) return false;
    if (filters.category && product.category !== filters.category) return false;
    if (!matchesQuick(product, filters.quick)) return false;
    if (filters.taste && product.taste !== filters.taste) return false;
    if (filters.texture && product.texture !== filters.texture) return false;

    // Products without a value for a limited field are hidden when that limit is set, rather than assumed to pass.
    if (filters.maxPrice !== null && (product.price === null || product.price > filters.maxPrice)) return false;
    if (filters.maxSugar !== null && (product.sugar === null || product.sugar > filters.maxSugar)) return false;
    if (filters.maxSodium !== null && (product.sodium_mg === null || product.sodium_mg > filters.maxSodium)) return false;
    if (filters.maxPrepMinutes !== null && (product.prep_minutes === null || product.prep_minutes > filters.maxPrepMinutes)) return false;

    if (filters.allergensToAvoid.some((allergen) => product.allergens.includes(allergen))) return false;
    if (filters.ingredientsToAvoid.some((term) => ingredientsContain(product, term))) return false;

    return true;
  });
}
