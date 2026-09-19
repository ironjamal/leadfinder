export type FilterValue = "all" | "none" | "listed";

interface Props {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  counts: { all: number; none: number; listed: number };
}

const OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "none", label: "No Website" },
  { value: "listed", label: "Website Listed" },
];

export default function FilterBar({ value, onChange, counts }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((opt) => {
        const isActive = value === opt.value;
        const isNoWebsite = opt.value === "none";
        const activeClasses = "border-accent bg-accent text-fg";
        const inactiveClasses = isNoWebsite
          ? "border-accent/50 bg-accent/5 text-accent hover:bg-accent/10"
          : "border-fg/15 bg-transparent text-muted hover:border-fg/30 hover:text-fg";

        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive ? activeClasses : inactiveClasses
            }`}
          >
            {opt.label} ({counts[opt.value]})
          </button>
        );
      })}
    </div>
  );
}
