import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "ML Simulations",
  description: "Interactive machine learning simulations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
       
      </body>
    </html>
  );
}