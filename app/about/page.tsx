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
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          About This Project
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
          Learn machine learning by watching it think, fail, and improve —
          instead of memorizing formulas you never see in action.
        </p>
      </header>

      {/* Why */}
      <Card className="border-border/60">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Why This Exists</CardTitle>
          <CardDescription>Understanding beats memorization</CardDescription>
        </CardHeader>
        <CardContent className="max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Most machine learning resources focus on equations, theory, and
            final accuracy numbers. While important, this often hides how models
            actually behave during training and prediction.
          </p>
          <p>
            This project is built around intuition. By visualizing algorithms
            and letting you interact with parameters, you can see why outcomes
            change, where assumptions break, and how small decisions affect
            results.
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
            <li>
              • Explore machine learning algorithms through interactive
              simulations
            </li>
            <li>• Adjust parameters and observe behavior in real time</li>
            <li>• Understand overfitting, underfitting, and noise visually</li>
            <li>
              • Compare models, decision boundaries, and evaluation metrics
            </li>
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
            This platform is designed for students, developers, and curious
            learners who want to understand how machine learning models behave
            under the hood.
          </p>
          <p className="text-muted-foreground">
            You don’t need advanced mathematics — curiosity, experimentation,
            and asking “why?” are enough.
          </p>
        </CardContent>
      </Card>

      {/* Philosophy */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium tracking-tight">
          Design Philosophy
        </h2>

        <div className="grid gap-3 text-sm text-muted-foreground">
          <p>• Visual intuition comes before formal mathematics</p>
          <p>• Simple, controlled datasets before real-world complexity</p>
          <p>• Failure cases are as important as success stories</p>
          <p>• The best learning happens through experimentation</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t pt-8 text-sm text-muted-foreground">
        Machine learning isn’t magic — it’s patterns, tradeoffs, and decisions
        made visible.
      </footer>
    </div>
  );
}
