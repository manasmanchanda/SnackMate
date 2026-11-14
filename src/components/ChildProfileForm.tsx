import { useState, type FormEvent } from 'react';
import { Save } from 'lucide-react';
import { ErrorNotice } from '@/components/ui';
import { ALLERGENS, FLAVOUR_OPTIONS, TEXTURES, titleCase } from '@/lib/productModel';
import { saveChildProfile, type ChildProfile } from '@/lib/passportApi';

const RESTRICTION_OPTIONS = ['Low sugar', 'Low sodium', 'Lactose free', 'Gluten free', 'Nut free', 'Vegetarian'];

function splitList(raw: string): string[] {
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function ChipGroup({ legend, options, selected, onToggle }: { legend: string; options: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <fieldset>
      <legend className="label">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-bold transition ${
                active ? 'border-mint-700 bg-mint-700 text-white' : 'border-cream-200 bg-white text-ink-800 hover:border-mint-500'
              }`}
            >
              {titleCase(option)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ChildProfileForm({ initial, onSaved }: { initial: ChildProfile; onSaved: () => void }) {
  const [childName, setChildName] = useState(initial.child_name);
  const [flavours, setFlavours] = useState(initial.preferred_flavours);
  const [textures, setTextures] = useState(initial.preferred_textures);
  const [allergies, setAllergies] = useState(initial.food_allergies);
  const [restrictions, setRestrictions] = useState(initial.dietary_restrictions);
  const [favourites, setFavourites] = useState(initial.favourite_snacks.join(', '));
  const [dislikes, setDislikes] = useState(initial.disliked_ingredients.join(', '));
  const [budget, setBudget] = useState(initial.max_budget === null ? '' : String(initial.max_budget));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaved(false);

    const budgetValue = budget.trim() === '' ? null : Number(budget);
    if (budgetValue !== null && (!Number.isFinite(budgetValue) || budgetValue < 0)) {
      setError('Please enter a budget of zero or more.');
      return;
    }

    setSubmitting(true);
    try {
      await saveChildProfile({
        child_name: childName.trim(),
        preferred_flavours: flavours,
        preferred_textures: textures,
        food_allergies: allergies,
        dietary_restrictions: restrictions,
        favourite_snacks: splitList(favourites),
        disliked_ingredients: splitList(dislikes),
        max_budget: budgetValue,
      });
      setSaved(true);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your profile could not be saved. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="cp-name">Child's first name</label>
          <input id="cp-name" className="input" value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="e.g. Aanya" />
        </div>
        <div>
          <label className="label" htmlFor="cp-budget">Usual snack budget per pack</label>
          <input id="cp-budget" type="number" inputMode="decimal" min="0" step="0.01" className="input" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </div>
      </div>

      <ChipGroup legend="Flavours your child likes" options={FLAVOUR_OPTIONS} selected={flavours} onToggle={(v) => setFlavours(toggle(flavours, v))} />
      <ChipGroup legend="Textures your child likes" options={TEXTURES} selected={textures} onToggle={(v) => setTextures(toggle(textures, v))} />
      <ChipGroup legend="Food allergies" options={ALLERGENS} selected={allergies} onToggle={(v) => setAllergies(toggle(allergies, v))} />
      <ChipGroup legend="Dietary requirements" options={RESTRICTION_OPTIONS} selected={restrictions} onToggle={(v) => setRestrictions(toggle(restrictions, v))} />

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="cp-favourites">Favourite snacks</label>
          <textarea id="cp-favourites" rows={2} className="input" value={favourites} onChange={(e) => setFavourites(e.target.value)} placeholder="Separate with commas" />
        </div>
        <div>
          <label className="label" htmlFor="cp-dislikes">Ingredients to avoid</label>
          <textarea id="cp-dislikes" rows={2} className="input" value={dislikes} onChange={(e) => setDislikes(e.target.value)} placeholder="e.g. palm oil, sesame" />
        </div>
      </div>

      {error && <ErrorNotice message={error} />}
      {saved && (
        <div className="rounded-2xl border border-mint-200 bg-mint-50 px-4 py-3 text-sm font-semibold text-mint-900" role="status">
          Profile saved. Explore Snacks will use these choices when you filter.
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className="btn-primary">
          <Save className="h-4 w-4" />
          {submitting ? 'Saving...' : 'Save profile'}
        </button>
      </div>
    </form>
  );
}
