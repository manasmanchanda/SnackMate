export function SimilarityMeter({ label, value }: { label: string; value: number | null }) {
  const known = value !== null;
  const tone = !known ? 'bg-cream-200' : value >= 70 ? 'bg-mint-500' : value >= 45 ? 'bg-sunny-200' : 'bg-peach-200';

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-bold text-ink-800">
        <span>{label}</span>
        <span>{known ? `${value}%` : 'Not enough info'}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-cream-200" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={known ? value : undefined}>
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${tone}`} style={{ width: known ? `${value}%` : '0%' }} />
      </div>
    </div>
  );
}
