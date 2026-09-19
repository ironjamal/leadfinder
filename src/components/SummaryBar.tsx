interface Props {
  totalResults: number;
  noWebsite: number;
  websiteListed: number;
  savedCount: number;
}

export default function SummaryBar({ totalResults, noWebsite, websiteListed, savedCount }: Props) {
  const stats: { label: string; value: number; accent?: boolean }[] = [
    { label: "Total Results", value: totalResults },
    { label: "No Website", value: noWebsite, accent: true },
    { label: "Website Listed", value: websiteListed },
    { label: "Saved Leads", value: savedCount },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-fg/10 bg-white/[0.02] px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-muted">{stat.label}</p>
          <p className={`mt-1 text-2xl font-semibold ${stat.accent ? "text-accent" : "text-fg"}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
