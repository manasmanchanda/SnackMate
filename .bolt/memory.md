# Project memory

## Product intent & audience

- Web app for parents to find, compare, and discover kid-friendly snack alternatives matched to children's dietary requirements and preferences.
- Core flows include a guided "Finder" experience and a direct "I Have a Snack in Mind" search for users who already know a snack they want alternatives to.

## Brand personality & voice

- Parent-focused and trustworthy; informative without being clinical.
- UI feedback is subtle and helpful (e.g., "Showing closest matches for '[query]'" labels, relevance badges) rather than playful/childish.

## Visual design & UX direction

- Vite + React + Tailwind CSS; Lucide React icons only.
- Responsive, production-quality layouts; avoid cookie-cutter styling.
- Search results display relevance as a percentage badge on each card; "no results" only when input is unrelated to any food/snack concept.
- Reusable components live under `src/components/`; feature pages (e.g., FinderPage, HomePage) under `src/pages/` or similar.

## Decisions, constraints & rationale

- `@/` path alias maps to `src/`; prefer it over deep relative imports.
- Do not install UI theme/icon packages beyond the template defaults; Fuse.js was added as a justified exception for fuzzy/semantic search.
- Search indexes across product name, brand, flavour, ingredients, texture, category, tags, and allergens, with field weighting (product name highest priority).
- Snack data model (ProductModel) includes: product name, brand, flavour, ingredients, texture, category, tags, allergens.
- Fuzzy match thresholds and a food-term checker decide between showing closest matches vs. a true empty state.

## Open questions & assumptions

- Snack database source/location not yet confirmed (assumed local/in-repo dataset).
- Dietary requirement/preference filtering integration with fuzzy search not detailed yet.
- Relevance score presentation (badge placement/wording) may need polish based on user feedback.