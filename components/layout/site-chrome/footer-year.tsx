"use client";

import * as React from "react";

// Client island for the copyright year: under Cache Components,
// `new Date()` must not run during prerender, so read it in an effect
// after mount. Prerender emits the fallback; client hydrates the year.
export function FooterYear() {
  const [year, setYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  if (year === null) return null;
  return <>{year}</>;
}
