import type { ReactNode } from 'react';
import { CheckCircle2, LockKeyhole, ShieldQuestion } from 'lucide-react';
import type { ProductSource, VerificationStatus, VegetarianClassification } from '@/lib/productModel';

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl animate-fade-up">
        {eyebrow && <p className="mb-2 text-sm font-extrabold uppercase tracking-wider text-mint-700">{eyebrow}</p>}
        <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 text-base text-ink-700">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function SourceBadge({ source }: { source: ProductSource }) {
  if (source === 'user_submitted') {
    return (
      <span className="inline-flex items-center rounded-full bg-sunny-200 px-2.5 py-1 text-xs font-bold text-ink-900">
        Added by a parent
      </span>
    );
  }
  if (source === 'catalogue') {
    return (
      <span className="inline-flex items-center rounded-full bg-mint-100 px-2.5 py-1 text-xs font-bold text-mint-900">
        Catalogue entry
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-cream-200 px-2.5 py-1 text-xs font-bold text-ink-800">
      Sample
    </span>
  );
}

export function VegBadge({ vegetarian }: { vegetarian: VegetarianClassification | null }) {
  if (!vegetarian) return null;
  const isVeg = vegetarian === 'veg';
  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded border-2 text-[10px] font-black ${
        isVeg ? 'border-mint-700 text-mint-700' : 'border-red-600 text-red-600'
      }`}
      title={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
    >
      {isVeg ? '\u25CF' : '\u25CB'}
    </span>
  );
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-mint-100 px-2.5 py-1 text-xs font-bold text-mint-900">
        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
      </span>
    );
  }
  if (status === 'partially_verified') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sunny-100 px-2.5 py-1 text-xs font-bold text-ink-900">
        <CheckCircle2 className="h-3.5 w-3.5" /> Partially verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-2.5 py-1 text-xs font-bold text-ink-700">
      <ShieldQuestion className="h-3.5 w-3.5" /> Unverified
    </span>
  );
}

export function ErrorNotice({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
      {message}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <p className="font-display text-xl font-semibold text-ink-900">{title}</p>
      <p className="mt-2 max-w-md text-ink-700">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SignInPrompt({ message }: { message: string }) {
  return (
    <div className="card flex flex-col items-center gap-4 px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-100 text-mint-800">
        <LockKeyhole className="h-7 w-7" />
      </span>
      <p className="max-w-md text-ink-800">{message}</p>
      <a href="#/profile" className="btn-primary">
        Sign in or create an account
      </a>
    </div>
  );
}

export function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ink-700" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-mint-200 border-t-mint-700" />
      <span className="font-semibold">{label}</span>
    </div>
  );
}
