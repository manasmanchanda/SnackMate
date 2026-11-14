import { NUTRITION_FIELDS, formatNumber, type Product } from '@/lib/productModel';

export type SimilarityScores = {
  taste: number | null;
  texture: number | null;
  flavour: number | null;
  nutrition: number | null;
  overall: number;
};

export type Alternative = {
  product: Product;
  scores: SimilarityScores;
};

const SALTY_FAMILY = ['salty', 'savoury'];

function scoreTaste(a: Product, b: Product): number | null {
  if (!a.taste || !b.taste) return null;
  if (a.taste === b.taste) return 100;
  if (SALTY_FAMILY.includes(a.taste) && SALTY_FAMILY.includes(b.taste)) return 75;
  if (a.taste === 'mild' || b.taste === 'mild') return 45;
  return 25;
}

function scoreTexture(a: Product, b: Product): number | null {
  if (!a.texture || !b.texture) return null;
  if (a.texture === b.texture) return 100;
  const crispy = ['crunchy', 'chewy'];
  if (crispy.includes(a.texture) && crispy.includes(b.texture)) return 60;
  const soft = ['soft', 'creamy'];
  if (soft.includes(a.texture) && soft.includes(b.texture)) return 70;
  return 30;
}

function scoreFlavour(a: Product, b: Product): number | null {
  if (!a.flavour || !b.flavour) return null;
  const wordsA = a.flavour.toLowerCase().split(/\s+/);
  const wordsB = b.flavour.toLowerCase().split(/\s+/);
  if (a.flavour.trim().toLowerCase() === b.flavour.trim().toLowerCase()) return 100;
  if (wordsA.some((word) => wordsB.includes(word))) return 65;
  return 20;
}

function scoreNutrition(a: Product, b: Product): number | null {
  const pairs: Array<[number | null, number | null, number]> = [
    [a.calories, b.calories, 0.3],
    [a.sugar, b.sugar, 0.25],
    [a.total_fat, b.total_fat, 0.2],
    [a.sodium_mg, b.sodium_mg, 0.25],
  ];

  let weighted = 0;
  let totalWeight = 0;
  for (const [valueA, valueB, weight] of pairs) {
    if (valueA === null || valueB === null) continue;
    const reference = Math.max(valueA, valueB, 1);
    const closeness = 1 - Math.abs(valueA - valueB) / reference;
    weighted += closeness * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return null;
  return Math.round((weighted / totalWeight) * 100);
}

function average(values: Array<number | null>): number {
  const known = values.filter((value): value is number => value !== null);
  if (known.length === 0) return 0;
  return Math.round(known.reduce((sum, value) => sum + value, 0) / known.length);
}

export function scoreSimilarity(original: Product, candidate: Product): SimilarityScores {
  const taste = scoreTaste(original, candidate);
  const texture = scoreTexture(original, candidate);
  const flavour = scoreFlavour(original, candidate);
  const nutrition = scoreNutrition(original, candidate);
  const categoryBonus = original.category === candidate.category ? 100 : 40;
  const overall = Math.round(average([taste, texture, flavour, categoryBonus]));
  return { taste, texture, flavour, nutrition, overall };
}

export function describeDifferences(original: Product, candidate: Product): string[] {
  const differences: Array<{ text: string; size: number }> = [];

  for (const field of NUTRITION_FIELDS) {
    const base = original[field.key];
    const other = candidate[field.key];
    if (base === null || other === null) continue;
    const diff = other - base;
    const relative = Math.abs(diff) / Math.max(base, 1);
    if (relative < 0.15) continue;
    const direction = diff > 0 ? 'more' : 'less';
    differences.push({
      text: `${field.label}: ${formatNumber(Math.abs(diff), field.unit)} ${direction}`,
      size: relative,
    });
  }

  return differences.sort((a, b) => b.size - a.size).map((item) => item.text);
}

export function findAlternatives(original: Product, catalogue: Product[], limit = 12): Alternative[] {
  return catalogue
    .filter((product) => product.id !== original.id && product.kind === original.kind)
    .map((product) => ({ product, scores: scoreSimilarity(original, product) }))
    .sort((a, b) => b.scores.overall - a.scores.overall)
    .slice(0, limit);
}
