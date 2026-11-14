import { ScanLine, Clock, ArrowLeft } from 'lucide-react';

export function LabelHelperPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="card relative overflow-hidden p-8 text-center sm:p-14">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sunny-200/70 blur-2xl" aria-hidden="true" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-mint-200/70 blur-2xl" aria-hidden="true" />

        <div className="relative space-y-6">
          <span className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-mint-100 text-mint-800 shadow-soft">
            <ScanLine className="h-12 w-12 animate-pulse" />
            <span className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-peach-500 text-white">
              <Clock className="h-5 w-5" />
            </span>
          </span>

          <span className="inline-flex rounded-full bg-peach-100 px-4 py-1.5 text-sm font-extrabold uppercase tracking-wider text-peach-700">Coming Soon</span>

          <h1 className="text-3xl font-semibold sm:text-4xl">Scan-to-Understand Label Helper</h1>
          <p className="mx-auto max-w-xl text-lg text-ink-700">
            Understand food ingredients and nutritional information in simple language.
          </p>
          <p className="mx-auto max-w-xl rounded-2xl bg-cream-100 px-5 py-4 font-semibold text-ink-800">
            We're working on making food labels easier to understand. This feature will be available soon!
          </p>

          <div className="pt-2">
            <a href="#/" className="btn-primary">
              <ArrowLeft className="h-4 w-4" /> Return to the homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
