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
- **SEO Optimized** — Dynamic metadata, Open Graph tags, sitemap, and more

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
│   ├── layout.tsx                # Root layout with SEO metadata
│   ├── sitemap.ts                # Auto-generated sitemap
│   ├── robots.ts                 # Search engine directives
│   ├── cardData.ts               # Featured cards data
│   ├── about/                    # About page
│   │   └── layout.tsx            # About page metadata
│   ├── learn/                    # Articles section
│   │   ├── page.tsx              # Articles listing
│   │   ├── layout.tsx            # Articles section metadata
│   │   └── [slug]/               # Dynamic article pages
│   │       ├── page.tsx          # Server component with generateMetadata
│   │       └── article-client.tsx # Client component
│   └── simulations/              # Simulations section
│       ├── page.tsx              # Simulations listing
│       ├── layout.tsx            # Simulations section metadata
│       └── [slug]/               # Dynamic simulation pages
│           ├── page.tsx          # Server component with generateMetadata
│           └── simulation-client.tsx # Client component
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
│   ├── utils.ts                  # Utility functions (cn())
│   ├── metadata.ts               # SEO metadata configuration
│   └── use-responsive-canvas.ts  # Hook for responsive canvas sizing
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

   Use the `useResponsiveCanvas` hook for mobile-friendly canvas simulations:

   ```tsx
   "use client";

   import { useEffect, useState, useCallback } from "react";
   import { useResponsiveCanvas } from "@/lib/use-responsive-canvas";

   export default function YourSimulation() {
     const { containerRef, canvasRef, size } = useResponsiveCanvas({
       maxWidth: 700,      // Maximum canvas width in pixels
       aspectRatio: 16/10, // Width divided by height
       minHeight: 300,     // Minimum height in pixels
     });
     const [parameter, setParameter] = useState(0.5);

     const draw = useCallback(() => {
       const canvas = canvasRef.current;
       if (!canvas) return;
       const ctx = canvas.getContext("2d");
       if (!ctx) return;

       // Use size.width and size.height for calculations
       ctx.fillStyle = "#ffffff";
       ctx.fillRect(0, 0, size.width, size.height);

       // Your drawing logic here
     }, [parameter, size]);

     useEffect(() => {
       draw();
     }, [draw]);

     return (
       <div>
         {/* Container div with ref for resize detection */}
         <div ref={containerRef} className="w-full max-w-2xl">
           <canvas
             ref={canvasRef}
             width={size.width}
             height={size.height}
             className="w-full rounded-lg border"
           />
         </div>
         {/* Add controls */}
       </div>
     );
   }
   ```

   **Hook Options:**
   | Option | Default | Description |
   |--------|---------|-------------|
   | `maxWidth` | 700 | Maximum canvas width in pixels |
   | `aspectRatio` | 16/10 | Canvas aspect ratio (width/height) |
   | `minHeight` | 300 | Minimum canvas height in pixels |

   **Returns:**
   - `containerRef` - Attach to wrapper div for resize detection
   - `canvasRef` - Attach to canvas element
   - `size` - Object with `width` and `height` values

3. **Register the simulation**

   Add to `simulationComponents` in `app/simulations/[slug]/simulation-client.tsx`:

   ```tsx
   const simulationComponents: Record<string, React.ComponentType> = {
     // ... existing simulations
     "your-simulation": YourSimulation,
   };
   ```

4. **Add SEO metadata**

   Add entry to `simulationMetadata` in `lib/metadata.ts`:

   ```tsx
   "your-simulation": {
     title: "Your Simulation Title",
     description: "SEO description for search engines",
     image: "/images/category/your-simulation.png",
   },
   ```

5. **Add to the simulations listing**

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

2. **Register in the client component**

   Add to `articleComponents` in `app/learn/[slug]/article-client.tsx`:

   ```tsx
   const articleComponents: Record<string, React.ComponentType> = {
     // ... existing articles
     "your-article": YourArticle,
   };
   ```

3. **Add SEO metadata**

   Add entry to `articleMetadata` in `lib/metadata.ts`:

   ```tsx
   "your-article": {
     title: "Your Article Title",
     description: "SEO description for search engines",
     image: "/images/category/your-article.png",
     author: "Your Name",
   },
   ```

4. **Add to the articles listing**

   Add entry to `articles` array in `app/learn/page.tsx`

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
