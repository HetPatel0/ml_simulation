<p align="center">
  <img src="public/logo.png" alt="ML Simulations Logo" width="120" height="120" />
</p>

<h1 align="center">ML Simulations</h1>

<p align="center">
  <strong>Interactive machine learning educational platform with visual simulations</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## About

ML Simulations is an interactive educational platform designed to help users understand machine learning concepts through visual simulations. Watch algorithms come alive, adjust parameters in real-time, and build deep intuition for how ML models work.

**No signup required** — jump straight into any simulation and start learning.

## Features

- **Interactive Simulations** — Visualize ML algorithms working in real-time
- **In-depth Articles** — Comprehensive explanations with embedded visualizations
- **Parameter Controls** — Adjust learning rates, data points, and model parameters
- **Dark/Light Mode** — Comfortable viewing in any environment
- **Responsive Design** — Works seamlessly on desktop and mobile
- **100% Free & Open Source**

## Available Content

### Simulations

| Category | Simulations |
|----------|-------------|
| **Regression** | Gradient Descent, Least Squares, Linear Regression Interactive, Polynomial Regression, Support Vector Regression |
| **Classification** | Logistic Regression, Logistic Function Visualizer, Logistic Training Simulation |
| **Advanced** | Kernel Trick Visualizer |

### Articles

| Category | Articles |
|----------|----------|
| **Regression** | Gradient Descent, Linear Regression, Polynomial Regression, Support Vector Regression |
| **Classification** | Logistic Regression |
| **Advanced** | Kernel Methods |

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with oklch() color system
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scroll**: [Lenis](https://github.com/darkroomengineering/lenis)
- **Icons**: [Lucide React](https://lucide.dev/), [Hugeicons](https://hugeicons.com/)

## Project Structure

```
ml_simulation/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── cardData.ts               # Featured cards data
│   ├── about/                    # About page
│   ├── learn/                    # Articles section
│   │   ├── page.tsx              # Articles listing
│   │   └── [slug]/               # Dynamic article pages
│   │       ├── page.tsx
│   │       └── layout.tsx
│   └── simulations/              # Simulations section
│       ├── page.tsx              # Simulations listing
│       └── [slug]/               # Dynamic simulation pages
│           └── page.tsx
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   ├── badge.tsx
│   │   └── separator.tsx
│   ├── common/                   # Shared components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── logo.tsx
│   │   ├── sim-header.tsx
│   │   └── article-header.tsx
│   ├── simulations/              # ML visualization components
│   │   ├── GradientDescent.tsx
│   │   ├── LeastSquares.tsx
│   │   ├── LinearRegressionInteractive.tsx
│   │   ├── LogisticRegression.tsx
│   │   ├── LogisticFunctionVisualizer.tsx
│   │   ├── LogisticTrainingSim.tsx
│   │   ├── PolynomialRegression.tsx
│   │   ├── SVRVisualizer.tsx
│   │   ├── SupportVectorRegression.tsx
│   │   └── KernelTrickVisualizer.tsx
│   ├── articles/                 # Article content components
│   │   ├── article-post.tsx
│   │   ├── GradientDescentArticle.tsx
│   │   ├── LinearRegressionArticle.tsx
│   │   ├── PolynomialRegressionArticle.tsx
│   │   ├── LogisticRegressionArticle.tsx
│   │   ├── SVRArticle.tsx
│   │   ├── KernelTrickArticle.tsx
│   │   └── LeastSquaresArticle.tsx
│   ├── learning-card.tsx
│   ├── theme-provider.tsx
│   ├── mode-toogle.tsx
│   └── lenis-provider.tsx
│
├── lib/
│   └── utils.ts                  # Utility functions (cn())
│
├── public/
│   ├── logo.png                  # Project logo
│   ├── images/                   # Simulation thumbnails
│   │   ├── regression/
│   │   ├── classification/
│   │   └── other/
│   └── article/                  # Article images
│       ├── regression/
│       ├── classification/
│       └── other/
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.x or later
- [pnpm](https://pnpm.io/) (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Keval144/ml_simulation.git
   cd ml_simulation
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Contributing

Contributions are welcome! Here's how you can help:

### Adding a New Simulation

1. **Create the simulation component**

   ```bash
   # Create your component in the simulations folder
   touch components/simulations/YourSimulation.tsx
   ```

2. **Build your visualization**

   Follow this pattern for Canvas-based simulations:

   ```tsx
   "use client";

   import { useRef, useEffect, useState } from "react";

   export default function YourSimulation() {
     const canvasRef = useRef<HTMLCanvasElement>(null);
     const [parameter, setParameter] = useState(0.5);

     useEffect(() => {
       const canvas = canvasRef.current;
       if (!canvas) return;
       const ctx = canvas.getContext("2d");
       if (!ctx) return;

       // Your drawing logic here
     }, [parameter]);

     return (
       <div>
         <canvas ref={canvasRef} width={600} height={400} />
         {/* Add controls */}
       </div>
     );
   }
   ```

3. **Register the simulation**

   Add to `simulationComponents` in `app/simulations/[slug]/page.tsx`:

   ```tsx
   const simulationComponents: Record<string, React.ComponentType> = {
     // ... existing simulations
     "your-simulation": YourSimulation,
   };
   ```

4. **Add to the simulations listing**

   Add entry to `simulations` array in `app/simulations/page.tsx`:

   ```tsx
   {
     id: "your-simulation",
     title: "Your Simulation Title",
     description: "Description of what your simulation demonstrates",
     image: "/images/category/your-simulation.png",
     badge: "Category",
     category: "regression", // or classification, clustering, other
   }
   ```

### Adding a New Article

1. **Create the article component**

   ```bash
   touch components/articles/YourArticle.tsx
   ```

2. **Add to the articles listing**

   Add entry to `articals` array in `app/learn/page.tsx`

3. **Register in the dynamic route**

   Add to the component map in `app/learn/[slug]/page.tsx`

### General Guidelines

- **Code Style**: Follow existing patterns in the codebase
- **TypeScript**: Use strict typing
- **Styling**: Use Tailwind CSS with the `cn()` utility from `@/lib/utils`
- **Images**: Use Next.js `Image` component
- **Components**: Use `"use client"` directive for interactive components

### Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test locally**
   ```bash
   pnpm build
   ```
5. **Commit with a descriptive message**
6. **Push to your fork**
7. **Open a Pull Request**

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with Next.js, React, and a passion for ML education
</p>
