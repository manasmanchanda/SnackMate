import { useMemo, useState, type FormEvent } from 'react';
import { ArrowRight, Gift, ScanLine, Search, Sparkles, Sun, Sandwich, PartyPopper, Backpack, Trees } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ErrorNotice, LoadingBlock } from '@/components/ui';
import { navigate } from '@/lib/router';
import { useProducts } from '@/lib/useProducts';
import { readRecentlyExplored } from '@/lib/recentlyExplored';

const HERO_IMAGE = 'https://images.pexels.com/photos/9134584/pexels-photo-9134584.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const INSPIRATION = [
  { icon: Sun, label: 'Everyday', idea: 'Yogurt berry parfait with a sprinkle of oats for a gentle start to the afternoon.' },
  { icon: Backpack, label: 'School tiffin', idea: 'Veggie sticks with hummus and a few cheese crackers, packed in a cool box.' },
  { icon: PartyPopper, label: 'Birthday party', idea: 'Coconut date energy bites and fruit skewers, served on small paper plates.' },
  { icon: Trees, label: 'Picnic', idea: 'Apple slices with peanut butter, rice cakes and a bag of mixed nuts.' },
  { icon: Gift, label: 'Festival', idea: 'Roasted nut clusters and popcorn in small boxes, shared with friends and family.' },
];

export function HomePage() {
  const { products, loading, error } = useProducts();
  const [searchText, setSearchText] = useState('');
  const [recentIds] = useState(() => readRecentlyExplored());

  const featured = useMemo(() => products.filter((p) => p.kind === 'packaged').slice(0, 3), [products]);
  const homemade = useMemo(() => products.filter((p) => p.kind === 'homemade').slice(0, 3), [products]);
  const recent = useMemo(() => recentIds.map((id) => products.find((p) => p.id === id)).filter((p) => p !== undefined), [recentIds, products]);
  const todaysIdea = INSPIRATION[new Date().getDay() % INSPIRATION.length];
  const TodayIcon = todaysIdea.icon;

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/finder?q=${encodeURIComponent(searchText.trim())}`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div className="animate-fade-up space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-mint-800 shadow-soft">
            <Sparkles className="h-4 w-4 text-peach-500" /> Smart snack discovery for parents
          </span>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Every Craving Deserves a <span className="text-mint-700">Better Choice.</span>
          </h1>
          <p className="max-w-xl text-lg text-ink-700">
            SnackMate helps you find friendlier alternatives to your child's favourite snacks, compare packaged products side by side, and discover snack ideas that fit your child's tastes and dietary needs.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#/explore" className="btn-primary">Explore snacks <ArrowRight className="h-4 w-4" /></a>
            <a href="#/compare" className="btn-secondary">Compare products</a>
          </div>
        </div>
        <div className="relative animate-fade-up">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-mint-100 to-sunny-100" />
          <img src={HERO_IMAGE} alt="A platter of crackers, dip and fresh vegetables" className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift" />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2" aria-label="Choose how to start">
        <div className="card flex flex-col gap-5 p-7 transition hover:-translate-y-1 hover:shadow-lift">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-peach-100 text-peach-700"><Search className="h-6 w-6" /></span>
          <div>
            <h2 className="text-2xl font-semibold">I Have a Snack in Mind</h2>
            <p className="mt-2 text-ink-700">Type your child's favourite packaged snack and discover similar alternatives with clear similarity scores.</p>
          </div>
          <form onSubmit={submitSearch} className="mt-auto flex gap-2" role="search">
            <label htmlFor="home-search" className="sr-only">Snack name or brand</label>
            <input id="home-search" className="input" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="e.g. cheesy puffs, choco chip" />
            <button type="submit" className="btn-primary shrink-0">Find</button>
          </form>
        </div>
        <div className="card flex flex-col gap-5 p-7 transition hover:-translate-y-1 hover:shadow-lift">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-100 text-mint-800"><Sandwich className="h-6 w-6" /></span>
          <div>
            <h2 className="text-2xl font-semibold">Suggest Something for Me</h2>
            <p className="mt-2 text-ink-700">Filter by budget, taste, texture, allergens and ingredients to see snack ideas that suit your child.</p>
          </div>
          <a href="#/explore" className="btn-primary mt-auto w-full sm:w-auto sm:self-start">Start suggesting <ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>

      {error && <ErrorNotice message={`We could not load the snack catalogue: ${error}`} />}
      {loading ? (
        <LoadingBlock label="Loading snacks..." />
      ) : (
        <>
          <section className="space-y-6">
            <SectionHeading title="Featured snacks" link={{ href: '#/finder', label: 'Find look-alikes' }} />
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Popular homemade alternatives" link={{ href: '#/explore?quick=homemade', label: 'See all ideas' }} />
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {homemade.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {recent.length > 0 && (
            <section className="space-y-4">
              <SectionHeading title="Recently explored" />
              <ul className="flex gap-3 overflow-x-auto pb-2">
                {recent.map((product) => (
                  <li key={product.id}>
                    <a href={`#/product/${product.id}`} className="card flex items-center gap-3 px-4 py-3 font-bold text-ink-900 transition hover:-translate-y-0.5">
                      {product.name}
                      <ArrowRight className="h-4 w-4 text-mint-700" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="card flex flex-col justify-between gap-6 bg-gradient-to-br from-sunny-100 to-white p-8">
          <div className="space-y-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-peach-700 shadow-soft"><TodayIcon className="h-6 w-6" /></span>
            <p className="text-sm font-extrabold uppercase tracking-wider text-peach-700">Today's inspiration - {todaysIdea.label}</p>
            <p className="font-display text-2xl font-semibold text-ink-900">{todaysIdea.idea}</p>
          </div>
          <a href="#/explore" className="btn-secondary w-fit">Explore more ideas</a>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {INSPIRATION.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label} className="card flex items-start gap-3 p-4">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-mint-700" />
                <div>
                  <p className="font-bold text-ink-900">{item.label}</p>
                  <p className="text-sm text-ink-700">{item.idea}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="grid items-center gap-6 rounded-[2rem] border border-white bg-white/80 p-8 shadow-soft md:grid-cols-[auto_1fr_auto]">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-mint-100 text-mint-800">
          <ScanLine className="h-8 w-8" />
          <span className="absolute -right-3 -top-3 rounded-full bg-peach-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">Coming Soon</span>
        </span>
        <div>
          <h2 className="text-2xl font-semibold">Scan-to-Understand Label Helper</h2>
          <p className="mt-2 text-ink-700">Understand food ingredients and nutritional information in simple language.</p>
        </div>
        <a href="#/label-helper" className="btn-secondary">Learn more</a>
      </section>
    </div>
  );
}

function SectionHeading({ title, link }: { title: string; link?: { href: string; label: string } }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {link && <a href={link.href} className="text-sm font-bold text-mint-800 hover:underline">{link.label}</a>}
    </div>
  );
}
