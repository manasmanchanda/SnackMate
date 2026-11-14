import Fuse from 'fuse.js';
import type { Product } from '@/lib/productModel';

export type SearchResult = {
  product: Product;
  score: number;
};

const FOOD_SYNONYMS: Record<string, string[]> = {
  cheese: ['cheesy', 'cheddar', 'cheese'],
  cheetos: ['cheese', 'puffs', 'corn'],
  chips: ['chips', 'crisps', 'potato'],
  cookies: ['cookie', 'biscuit', 'biscuits'],
  biscuit: ['biscuits', 'cookie', 'cookies'],
  chocolate: ['choco', 'cocoa', 'chocolate'],
  puffs: ['puffs', 'puffed', 'puff'],
  corn: ['corn', 'maize'],
  potato: ['potato', 'potatoes'],
  nuts: ['nut', 'nuts', 'almond', 'cashew', 'peanut'],
  spicy: ['spicy', 'chilli', 'chili', 'pepper', 'hot'],
  sweet: ['sweet', 'sugar', 'honey'],
  salty: ['salty', 'salt'],
  crunchy: ['crunchy', 'crisp', 'crispy'],
  soft: ['soft', 'chewy', 'creamy'],
};

function buildSearchableText(product: Product): string {
  return [
    product.name,
    product.brand ?? '',
    product.flavour ?? '',
    product.ingredients ?? '',
    product.taste ?? '',
    product.texture ?? '',
    product.category,
    ...product.tags,
    ...product.allergens,
  ]
    .filter(Boolean)
    .join(' ');
}

function expandQuery(query: string): string {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const expanded: string[] = [...words];

  for (const word of words) {
    const key = word.replace(/s$/, '');
    const synonyms = FOOD_SYNONYMS[word] ?? FOOD_SYNONYMS[key];
    if (synonyms) {
      expanded.push(...synonyms);
    }
  }

  return expanded.join(' ');
}

function createFuse(products: Product[]): Fuse<Product> {
  return new Fuse(products, {
    includeScore: true,
    threshold: 0.45,
    ignoreLocation: true,
    minMatchCharLength: 2,
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'brand', weight: 0.15 },
      { name: 'flavour', weight: 0.15 },
      { name: 'category', weight: 0.1 },
      { name: 'ingredients', weight: 0.1 },
      { name: 'tags', weight: 0.05 },
      { name: 'allergens', weight: 0.05 },
    ],
  });
}

function isFoodRelated(query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return false;

  const foodTerms = [
    'snack', 'food', 'chip', 'cookie', 'biscuit', 'puff', 'popcorn', 'cracker',
    'nut', 'seed', 'bar', 'candy', 'chocolate', 'choco', 'cheese', 'cream',
    'fruit', 'berry', 'apple', 'mango', 'banana', 'rice', 'corn', 'potato',
    'wheat', 'oat', 'honey', 'sugar', 'spice', 'spicy', 'salty', 'sweet',
    'sour', 'crunchy', 'soft', 'chewy', 'creamy', 'mild', 'yogurt', 'milk',
    'smoothie', 'juice', 'drink', 'cake', 'brownie', 'wafer', 'pretzel',
    'nacho', 'tortilla', 'bhel', 'namkeen', 'sev', 'kurmura', 'khakhra',
    'roasted', 'fried', 'baked', 'granola', 'flakes', 'muesli', 'puffcorn',
    'cheetos', 'kurkure', 'lays', 'doritos', 'pringles', 'oreo', 'parle',
    'britannia', 'haldiram', 'balaji', 'dingdong', 'munch', 'treat',
    'choco', 'wheat', 'jaggery', 'date', 'fig', 'raisin', 'almond',
    'cashew', 'pista', 'pistachio', 'walnut', 'peanut', 'caramel',
    'vanilla', 'strawberry', 'orange', 'lemon', 'cola', 'cream',
    'veg', 'protein', 'fibre', 'fiber', 'energy', 'diet',
  ];

  return foodTerms.some((term) => q.includes(term));
}

export function fuzzySearch(products: Product[], query: string, limit = 12): SearchResult[] {
  const trimmed = query.trim();
  if (trimmed === '') return [];

  const packaged = products.filter((p) => p.kind === 'packaged');

  const fuse = createFuse(packaged);
  const expanded = expandQuery(trimmed);
  const results = fuse.search(expanded);

  return results
    .filter((r) => r.score !== null && r.score !== undefined)
    .map((r) => ({
      product: r.item,
      score: Math.round((1 - (r.score ?? 1)) * 100),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function hasFoodRelevance(query: string): boolean {
  return isFoodRelated(query);
}

export function searchWithFallback(products: Product[], query: string, limit = 12): {
  results: SearchResult[];
  exactMatch: boolean;
  isCloseMatch: boolean;
} {
  const trimmed = query.trim();
  if (trimmed === '') {
    return { results: [], exactMatch: false, isCloseMatch: false };
  }

  const results = fuzzySearch(products, trimmed, limit);

  const exactMatch = results.length > 0 && results[0].score >= 90;

  const isCloseMatch = !exactMatch && results.length > 0 && results[0].score >= 30;

  return { results, exactMatch, isCloseMatch };
}
