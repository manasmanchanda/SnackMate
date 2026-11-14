import { useEffect, useState, type FormEvent } from 'react';
import { ImagePlus, Save, X } from 'lucide-react';
import { ErrorNotice } from '@/components/ui';
import {
  ALLERGENS,
  CATEGORIES,
  NUTRITION_FIELDS,
  TASTES,
  TEXTURES,
  titleCase,
  type NutritionKey,
  type Product,
  type ProductInput,
} from '@/lib/productModel';

type NumberFields = Record<NutritionKey | 'price', string>;

type FormState = {
  name: string;
  brand: string;
  category: string;
  ingredients: string;
  taste: string;
  texture: string;
  flavour: string;
  serving_size: string;
  package_quantity: string;
  allergens: string[];
  vegetarian: string;
  verification_status: string;
  numbers: NumberFields;
};

export type ProductFormSubmit = (input: ProductInput, file: File | null) => Promise<void>;

function toNumberOrNull(raw: string, label: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a number of zero or more.`);
  }
  return value;
}

function initialState(product: Product | null): FormState {
  const numbers = {} as NumberFields;
  for (const field of NUTRITION_FIELDS) {
    const value = product?.[field.key];
    numbers[field.key] = value === null || value === undefined ? '' : String(value);
  }
  numbers.price = product?.price !== null && product?.price !== undefined ? String(product.price) : '';

  return {
    name: product?.name ?? '',
    brand: product?.brand ?? '',
    category: product?.category ?? CATEGORIES[0],
    ingredients: product?.ingredients ?? '',
    taste: product?.taste ?? '',
    texture: product?.texture ?? '',
    flavour: product?.flavour ?? '',
    serving_size: product?.serving_size ?? '',
    package_quantity: product?.package_quantity ?? '',
    allergens: product?.allergens ?? [],
    vegetarian: product?.vegetarian ?? '',
    verification_status: product?.verification_status ?? 'unverified',
    numbers,
  };
}

export function ProductForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: Product | null;
  submitLabel: string;
  onSubmit: ProductFormSubmit;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => initialState(initial));
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const setText = (key: 'name' | 'brand' | 'category' | 'ingredients' | 'taste' | 'texture' | 'flavour' | 'serving_size' | 'package_quantity' | 'vegetarian' | 'verification_status', value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const setNumber = (key: keyof NumberFields, value: string) =>
    setForm((current) => ({ ...current, numbers: { ...current.numbers, [key]: value } }));

  const toggleAllergen = (allergen: string) =>
    setForm((current) => ({
      ...current,
      allergens: current.allergens.includes(allergen)
        ? current.allergens.filter((item) => item !== allergen)
        : [...current.allergens, allergen],
    }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('Please enter the product name.');
      return;
    }

    let input: ProductInput;
    try {
      const nutrition = Object.fromEntries(
        NUTRITION_FIELDS.map((field) => [field.key, toNumberOrNull(form.numbers[field.key], field.label)]),
      ) as Record<NutritionKey, number | null>;
      input = {
        name: form.name.trim(),
        brand: form.brand.trim() || null,
        category: form.category,
        image_url: initial?.image_url ?? null,
        ingredients: form.ingredients.trim() || null,
        allergens: form.allergens,
        taste: (form.taste || null) as ProductInput['taste'],
        texture: (form.texture || null) as ProductInput['texture'],
        flavour: form.flavour.trim() || null,
        serving_size: form.serving_size.trim() || null,
        package_quantity: form.package_quantity.trim() || null,
        price: toNumberOrNull(form.numbers.price, 'Price'),
        vegetarian: (form.vegetarian || null) as ProductInput['vegetarian'],
        verification_status: form.verification_status as ProductInput['verification_status'],
        ...nutrition,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please check the numbers you entered.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(input, file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while saving. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const shownImage = previewUrl ?? initial?.image_url ?? null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className="mb-4 font-display text-xl font-semibold text-ink-900">The basics</legend>
        <div>
          <label className="label" htmlFor="pf-name">Product name *</label>
          <input id="pf-name" className="input" value={form.name} onChange={(e) => setText('name', e.target.value)} placeholder="e.g. Cheesy Corn Puffs" required />
        </div>
        <div>
          <label className="label" htmlFor="pf-brand">Brand name</label>
          <input id="pf-brand" className="input" value={form.brand} onChange={(e) => setText('brand', e.target.value)} placeholder="e.g. Puffy Co" />
        </div>
        <div>
          <label className="label" htmlFor="pf-category">Product category</label>
          <select id="pf-category" className="input" value={form.category} onChange={(e) => setText('category', e.target.value)}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="pf-taste">Main taste</label>
          <select id="pf-taste" className="input" value={form.taste} onChange={(e) => setText('taste', e.target.value)}>
            <option value="">Not sure / not provided</option>
            {TASTES.map((taste) => (
              <option key={taste} value={taste}>{titleCase(taste)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="pf-texture">Texture</label>
          <select id="pf-texture" className="input" value={form.texture} onChange={(e) => setText('texture', e.target.value)}>
            <option value="">Not sure / not provided</option>
            {TEXTURES.map((texture) => (
              <option key={texture} value={texture}>{titleCase(texture)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="pf-flavour">Flavour</label>
          <input id="pf-flavour" className="input" value={form.flavour} onChange={(e) => setText('flavour', e.target.value)} placeholder="e.g. Cheese, Honey oat" />
        </div>
      </fieldset>

      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className="mb-4 font-display text-xl font-semibold text-ink-900">Classification</legend>
        <div>
          <label className="label" htmlFor="pf-veg">Vegetarian / Non-vegetarian</label>
          <select id="pf-veg" className="input" value={form.vegetarian} onChange={(e) => setText('vegetarian', e.target.value)}>
            <option value="">Not sure / not provided</option>
            <option value="veg">Vegetarian</option>
            <option value="non_veg">Non-vegetarian</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="pf-verify">Verification status</label>
          <select id="pf-verify" className="input" value={form.verification_status} onChange={(e) => setText('verification_status', e.target.value)}>
            <option value="unverified">Unverified</option>
            <option value="partially_verified">Partially verified</option>
            <option value="verified">Verified</option>
          </select>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 font-display text-xl font-semibold text-ink-900">Product photo</legend>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-36 w-full items-center justify-center overflow-hidden rounded-3xl border border-dashed border-mint-200 bg-mint-50 sm:w-48">
            {shownImage ? (
              <img src={shownImage} alt="Selected product" className="h-full w-full object-cover" />
            ) : (
              <span className="px-4 text-center text-sm font-semibold text-ink-700">No photo yet</span>
            )}
          </div>
          <div className="space-y-2">
            <label className="btn-secondary cursor-pointer">
              <ImagePlus className="h-4 w-4" />
              <span>{file ? 'Choose a different photo' : 'Upload a photo'}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const selected = e.target.files?.[0] ?? null;
                  if (selected && selected.size > 5 * 1024 * 1024) {
                    setError('Please choose a photo smaller than 5 MB.');
                    e.target.value = '';
                    return;
                  }
                  setError(null);
                  setFile(selected);
                }}
              />
            </label>
            <p className="text-xs text-ink-700">JPG, PNG or WebP, up to 5 MB.</p>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 font-display text-xl font-semibold text-ink-900">Ingredients and allergens</legend>
        <div>
          <label className="label" htmlFor="pf-ingredients">Ingredients list</label>
          <textarea id="pf-ingredients" rows={3} className="input" value={form.ingredients} onChange={(e) => setText('ingredients', e.target.value)} placeholder="Copy the ingredients exactly as printed on the pack" />
        </div>
        <div>
          <p className="label">Allergens on the label</p>
          <div className="flex flex-wrap gap-2">
            {ALLERGENS.map((allergen) => {
              const selected = form.allergens.includes(allergen);
              return (
                <button
                  key={allergen}
                  type="button"
                  onClick={() => toggleAllergen(allergen)}
                  aria-pressed={selected}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-bold transition ${
                    selected ? 'border-peach-500 bg-peach-100 text-peach-700' : 'border-cream-200 bg-white text-ink-800 hover:border-peach-200'
                  }`}
                >
                  {titleCase(allergen)}
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>

      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className="mb-4 font-display text-xl font-semibold text-ink-900">Nutrition per serving</legend>
        <p className="md:col-span-2 -mt-2 text-sm text-ink-700">Leave a box empty if the pack does not show that value. Empty values are shown as "Not provided".</p>
        {NUTRITION_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="label" htmlFor={`pf-${field.key}`}>{field.label} ({field.unit})</label>
            <input
              id={`pf-${field.key}`}
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              className="input"
              value={form.numbers[field.key]}
              onChange={(e) => setNumber(field.key, e.target.value)}
            />
          </div>
        ))}
        <div>
          <label className="label" htmlFor="pf-serving">Serving size</label>
          <input id="pf-serving" className="input" value={form.serving_size} onChange={(e) => setText('serving_size', e.target.value)} placeholder="e.g. 28 g (about 1 handful)" />
        </div>
      </fieldset>

      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className="mb-4 font-display text-xl font-semibold text-ink-900">Pack and price</legend>
        <div>
          <label className="label" htmlFor="pf-package">Package quantity</label>
          <input id="pf-package" className="input" value={form.package_quantity} onChange={(e) => setText('package_quantity', e.target.value)} placeholder="e.g. 85 g bag" />
        </div>
        <div>
          <label className="label" htmlFor="pf-price">Product price</label>
          <input id="pf-price" type="number" inputMode="decimal" min="0" step="0.01" className="input" value={form.numbers.price} onChange={(e) => setNumber('price', e.target.value)} />
        </div>
      </fieldset>

      {error && <ErrorNotice message={error} />}

      <div className="flex flex-col-reverse gap-3 border-t border-cream-200 pt-6 sm:flex-row sm:justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting} className="btn-primary">
          <Save className="h-4 w-4" />
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
