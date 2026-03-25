import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Engineering Hub | AI-Powered Precision Suite",
  description: "The complete 2026 engineering and document conversion suite. High-precision PDF to Excel, CAD conversion, and material estimation powered by AI document intelligence.",
  keywords: [
    "engineering hub", "pdf to excel ai", 
    "secure document conversion", "2026 seo tools", "online engineering tools", 
    "material calculator pro", "unit converter engineering", "precision ocr"
  ],
  authors: [{ name: "Engineering Hub Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  openGraph: {
    title: "Engineering Hub | Precision Suite",
    description: "AI-powered precision for your engineering documents.",
    url: "https://engineering-hub-official.vercel.app",
    siteName: "Engineering Hub",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Hub | 2026 Engineering Suite",
    description: "The world's most advanced AI document intelligence platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Engineering Hub",
    "operatingSystem": "Web",
    "applicationCategory": "ProductivityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "AI-powered document conversion and engineering calculator suite."
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --font-outfit: 'Outfit', sans-serif;
          }
        `}</style>
      </head>
      <body className={`${inter.variable} antialiased font-sans`} suppressHydrationWarning>
        <div className="relative overflow-hidden min-h-screen" suppressHydrationWarning>
          <div className="hero-glow top-0 -left-20 opacity-20" />
          <div className="hero-glow bottom-0 -right-20 opacity-10" />
          <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 scale-150" />
          {children}
        </div>
      </body>
    </html>
  );
}
