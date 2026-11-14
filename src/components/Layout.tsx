import { useState, type ReactNode } from 'react';
import { Bookmark, Cookie, Home, Menu, PartyPopper, PlusCircle, Scale, ScanLine, Search, Sparkles, UserRound, X } from 'lucide-react';
import { navigate, useRoute } from '@/lib/router';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/finder', label: 'Look-Alikes', icon: Search },
  { to: '/explore', label: 'Explore Snacks', icon: Sparkles },
  { to: '/compare', label: 'Compare Products', icon: Scale },
  { to: '/add-product', label: 'Add Your Product', icon: PlusCircle },
  { to: '/label-helper', label: 'Label Helper', icon: ScanLine, soon: true },
  { to: '/passport', label: 'My Passport', icon: Bookmark },
  { to: '/picnic', label: 'Picnic Planner', icon: PartyPopper },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export function Layout({ children }: { children: ReactNode }) {
  const { segments } = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  const current = segments[0] ? `/${segments[0]}` : '/';

  const goTo = (to: string) => {
    setMenuOpen(false);
    navigate(to);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-cream-50/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#/" className="group flex items-center gap-2" aria-label="SnackMate home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint-700 text-white shadow-soft transition group-hover:rotate-6">
              <Cookie className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-semibold text-ink-900">SnackMate</span>
              <span className="hidden text-xs font-semibold text-mint-800 sm:block">Every Craving Deserves a Better Choice</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
            {NAV_ITEMS.map((item) => {
              const active = current === item.to;
              return (
                <a
                  key={item.to}
                  href={`#${item.to}`}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold transition ${
                    active ? 'bg-mint-100 text-mint-900' : 'text-ink-700 hover:bg-white hover:text-mint-800'
                  }`}
                >
                  {item.label}
                  {item.soon && (
                    <span className="rounded-full bg-peach-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-peach-700">
                      Soon
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cream-200 bg-white text-ink-900 transition hover:border-mint-500 xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" className="animate-fade-up border-t border-cream-200 bg-cream-50 px-4 pb-4 pt-2 xl:hidden" aria-label="Mobile">
            <ul className="grid gap-1 sm:grid-cols-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = current === item.to;
                return (
                  <li key={item.to}>
                    <button
                      type="button"
                      onClick={() => goTo(item.to)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold transition ${
                        active ? 'bg-mint-100 text-mint-900' : 'text-ink-800 hover:bg-white'
                      }`}
                    >
                      <Icon className="h-5 w-5 text-mint-700" />
                      <span className="flex-1">{item.label}</span>
                      {item.soon && (
                        <span className="rounded-full bg-peach-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-peach-700">
                          Soon
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-cream-200 bg-white/70">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr] lg:px-8">
          <div>
            <p className="font-display text-lg font-semibold text-ink-900">SnackMate</p>
            <p className="mt-2 max-w-md text-sm text-ink-700">
              SnackMate shares general nutrition information to help you compare snacks. It does not give medical advice.
            </p>
          </div>
          <div className="rounded-2xl bg-sunny-100 p-4 text-sm text-ink-800">
            <p className="font-bold">Please read before you choose</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Nutrition values depend on serving size. Check the pack for the amount you will serve.</li>
              <li>Products added by parents are not verified by SnackMate. Always read the real pack label.</li>
              <li>Always check allergen information on the pack. A product is never guaranteed safe from its numbers alone.</li>
              <li>Consult a qualified healthcare professional for advice about your child's condition or diet.</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
