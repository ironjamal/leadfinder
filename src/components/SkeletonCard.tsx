export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-fg/10 bg-white/[0.02] p-5">
      <div className="mb-3 h-5 w-2/3 rounded bg-fg/10" />
      <div className="mb-4 h-3 w-1/3 rounded bg-fg/10" />
      <div className="mb-2 h-3 w-full rounded bg-fg/10" />
      <div className="mb-4 h-3 w-1/2 rounded bg-fg/10" />
      <div className="flex gap-2">
        <div className="h-8 w-24 rounded-lg bg-fg/10" />
        <div className="h-8 w-24 rounded-lg bg-fg/10" />
      </div>
    </div>
  );
}
