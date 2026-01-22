//TODO: Implement learn page Here it will be Blogs page With Diffreanciation between Regression and Classification
//TODO: Add Search Functionality to search for blogs
//TODO: Use Learning Cards with Proper Photos and Descriptions
//TODO: Use Blog Card that i made in components/BlogCard.tsx it will look like articles page like medium or times of india
//TODO: Here it will have sub routes like learn/[] for specific blog pages
//Example How to use BlogPost component from components/blog-card.tsx

import { BlogPost } from "@/components/blog-post";

export default function Home() {
  return (
    <>
      <BlogPost
        title="Why Gradient Descent Fails More Often Than You Think"
        author="Keval"
        date="January 2026"
        description={
          <>
            This article focuses on intuition rather than equations. You can
            also{" "}
            <a href="/simulations/gradient-descent">
              interact with the Gradient Descent simulation
            </a>{" "}
            to see these failures in action.
          </>
        }
        image={{
          src: "/images/gradient-descent-visual.png",
          alt: "Gradient descent visualization",
        }}
      >
        <p>
          Gradient descent is often presented as a guaranteed path toward the
          minimum, but in practice, optimization is fragile.
        </p>

        <h2>Learning Rate Instability</h2>
        <p>
          A slightly higher learning rate can cause divergence, while a lower
          one makes training unusably slow.
        </p>

        <h3>Why This Matters</h3>
        <p>
          Understanding failure modes builds stronger mental models than
          memorizing update rules.
        </p>
      </BlogPost>
    </>
  );
}
