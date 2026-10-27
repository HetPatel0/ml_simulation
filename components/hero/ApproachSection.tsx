const approaches = [
  {
    num: "01",
    title: "See the Math",
    desc: "Watch gradient descent converge. See decision boundaries form in real-time. Understand through direct observation.",
  },
  {
    num: "02",
    title: "Experiment Freely",
    desc: "Change learning rates, add noise, modify data. See how each parameter affects the outcome instantly.",
  },
  {
    num: "03",
    title: "Build Intuition",
    desc: "Move beyond memorizing formulas. Develop deep understanding that transfers to real problems.",
  },
];

export function ApproachSection() {
  return (
    <section className="px-6 py-24 md:py-32 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="reveal mb-16 max-w-xl">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Our Approach
          </span>
          <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
            Understanding through
            <br />
            <span className="font-medium">observation</span>
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {approaches.map((item) => (
            <div
              key={item.num}
              className="reveal group transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="font-mono text-2xl font-semibold text-primary/60">
                {item.num}
              </span>
              <h3 className="mt-3 text-xl font-medium tracking-tight transition-colors group-hover:text-primary">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
