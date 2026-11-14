export type Taste = 'sweet' | 'salty' | 'savoury' | 'sour' | 'mild';
export type Texture = 'crunchy' | 'soft' | 'chewy' | 'creamy';
export type ProductKind = 'packaged' | 'homemade';
export type ProductSource = 'sample' | 'user_submitted' | 'catalogue';
export type VegetarianClassification = 'veg' | 'non_veg';
export type VerificationStatus = 'verified' | 'partially_verified' | 'unverified';

export type Product = {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  kind: ProductKind;
  source: ProductSource;
  image_url: string | null;
  ingredients: string | null;
  allergens: string[];
  taste: Taste | null;
  texture: Texture | null;
  flavour: string | null;
  calories: number | null;
  total_carbs: number | null;
  sugar: number | null;
  added_sugar: number | null;
  protein: number | null;
  total_fat: number | null;
  saturated_fat: number | null;
  fibre: number | null;
  sodium_mg: number | null;
  trans_fat: number | null;
  serving_size: string | null;
  package_quantity: string | null;
  price: number | null;
  vegetarian: VegetarianClassification | null;
  verification_status: VerificationStatus;
  prep_minutes: number | null;
  preparation: string | null;
  tags: string[];
  created_by: string | null;
  created_at: string;
};

export type ProductInput = Pick<
  Product,
  | 'name'
  | 'brand'
  | 'category'
  | 'image_url'
  | 'ingredients'
  | 'allergens'
  | 'taste'
  | 'texture'
  | 'flavour'
  | 'calories'
  | 'total_carbs'
  | 'sugar'
  | 'added_sugar'
  | 'protein'
  | 'total_fat'
  | 'saturated_fat'
  | 'fibre'
  | 'sodium_mg'
  | 'serving_size'
  | 'package_quantity'
  | 'price'
  | 'trans_fat'
  | 'vegetarian'
  | 'verification_status'
>;

export type NutritionKey =
  | 'calories'
  | 'total_carbs'
  | 'sugar'
  | 'added_sugar'
  | 'protein'
  | 'total_fat'
  | 'saturated_fat'
  | 'trans_fat'
  | 'fibre'
  | 'sodium_mg';

export type NutritionField = {
  key: NutritionKey;
  label: string;
  unit: string;
  // Which direction is usually preferred when comparing, used only for neutral highlighting.
  preferred: 'lower' | 'higher';
};

export const NUTRITION_FIELDS: NutritionField[] = [
  { key: 'calories', label: 'Calories', unit: 'kcal', preferred: 'lower' },
  { key: 'total_carbs', label: 'Total carbohydrates', unit: 'g', preferred: 'lower' },
  { key: 'sugar', label: 'Sugar', unit: 'g', preferred: 'lower' },
  { key: 'added_sugar', label: 'Added sugar', unit: 'g', preferred: 'lower' },
  { key: 'protein', label: 'Protein', unit: 'g', preferred: 'higher' },
  { key: 'total_fat', label: 'Total fat', unit: 'g', preferred: 'lower' },
  { key: 'saturated_fat', label: 'Saturated fat', unit: 'g', preferred: 'lower' },
  { key: 'trans_fat', label: 'Trans fat', unit: 'g', preferred: 'lower' },
  { key: 'fibre', label: 'Fibre', unit: 'g', preferred: 'higher' },
  { key: 'sodium_mg', label: 'Sodium', unit: 'mg', preferred: 'lower' },
];

export const CATEGORIES = [
  'Puffs',
  'Chips',
  'Cookies',
  'Bars',
  'Popcorn',
  'Nuts and Seeds',
  'Crackers',
  'Dairy Snacks',
  'Rice Cakes',
  'Biscuits',
  'Fruit Snacks',
  'Other',
] as const;

export const TASTES: Taste[] = ['sweet', 'salty', 'savoury', 'sour', 'mild'];
export const TEXTURES: Texture[] = ['crunchy', 'soft', 'chewy', 'creamy'];

export const ALLERGENS = ['milk', 'egg', 'wheat', 'nuts', 'peanuts', 'soy', 'sesame', 'fish', 'shellfish'];

export const FLAVOUR_OPTIONS = ['sweet', 'salty', 'spicy', 'fruity', 'chocolate', 'cheese', 'honey', 'mild'];

export const INGREDIENT_OPTIONS = ['palm oil', 'artificial colour', 'added sugar', 'food colouring', 'msg'];

export function formatNumber(value: number | null, unit = ''): string {
  if (value === null || value === undefined) return 'Not provided';
  const rounded = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  return unit ? `${rounded} ${unit}` : rounded;
}

export function formatPrice(value: number | null): string {
  if (value === null || value === undefined) return 'Not provided';
  return value.toFixed(2);
}

export function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function ingredientsContain(product: Product, term: string): boolean {
  const needle = term.trim().toLowerCase();
  if (!needle) return false;
  return (product.ingredients ?? '').toLowerCase().includes(needle);
}
