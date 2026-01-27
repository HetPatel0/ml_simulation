import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/common/navbar";
import LenisProvider from "@/components/lenis-provider";
import FooterSection from "@/components/common/footer";
import { siteConfig } from "@/lib/metadata";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ML Simulations - Interactive Machine Learning Education",
    template: "%s | ML Simulations",
  },
  description: siteConfig.description,
  keywords: [
    "machine learning",
    "interactive simulations",
    "gradient descent",
    "linear regression",
    "logistic regression",
    "ML education",
    "visual learning",
    "data science",
    "deep learning",
    "neural networks",
  ],
  authors: [{ name: "Keval" }],
  creator: "Keval",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "ML Simulations - Interactive Machine Learning Education",
    description:
      "Watch machine learning algorithms come alive through interactive visualizations. Adjust parameters, see results instantly.",
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: "ML Simulations - Interactive Machine Learning Education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ML Simulations - Interactive Machine Learning Education",
    description:
      "Watch machine learning algorithms come alive through interactive visualizations.",
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LenisProvider>
            <Navbar />
            <main className="flex-1">{children} <Analytics /><SpeedInsights /></main>
             
            <FooterSection />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
