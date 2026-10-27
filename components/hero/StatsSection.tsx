const stats = [
  { value: "10+", label: "Simulations" },
  { value: "10+", label: "In-depth Articles" },
  { value: "100%", label: "Free & Open" },
];

export function StatsSection() {
  return (
    <section className="reveal border-y border-border bg-muted/30">
      <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4 px-6 py-12 text-center sm:gap-8">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums sm:text-3xl md:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
