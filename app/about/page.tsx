import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 space-y-16">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          About This Project
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Learn machine learning by seeing it work — not by memorizing formulas.
        </p>
      </header>

      {/* Why */}
      <Card className="border-border/60">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Why This Exists</CardTitle>
          <CardDescription>Understanding over memorization</CardDescription>
        </CardHeader>
        <CardContent className="max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Most machine learning resources emphasize equations and final
            accuracy. This often hides how models actually behave.
          </p>
          <p>
            This project focuses on intuition — by visualizing models and
            letting you interact with parameters, you can see why outcomes
            change and where models fail.
          </p>
        </CardContent>
      </Card>

      {/* What */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-xl">What You Can Do</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <ul className="grid gap-3 text-muted-foreground">
            <li>• Explore algorithms through interactive simulations</li>
            <li>• Modify parameters and observe real-time behavior</li>
            <li>• See overfitting, underfitting, and noise in action</li>
            <li>• Compare models and evaluation metrics visually</li>
          </ul>
        </CardContent>
      </Card>

      {/* Audience */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-xl">Who This Is For</CardTitle>
        </CardHeader>
        <CardContent className="max-w-3xl space-y-4 text-sm leading-relaxed">
          <p>
            This platform is built for students, developers, and curious
            learners who want a deeper understanding of machine learning
            behavior.
          </p>
          <p className="text-muted-foreground">
            You don’t need advanced math — curiosity and experimentation are
            enough.
          </p>
        </CardContent>
      </Card>

      {/* Philosophy */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium tracking-tight">
          Design Philosophy
        </h2>

        <div className="grid gap-3 text-sm text-muted-foreground">
          <p>• Visual intuition before formal mathematics</p>
          <p>• Simple datasets before real-world complexity</p>
          <p>• Failure cases matter as much as success</p>
          <p>• Learning happens through experimentation</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t pt-8 text-sm text-muted-foreground">
        Machine learning is not magic — it’s patterns, tradeoffs, and decisions.
      </footer>
    </div>
  );
}
