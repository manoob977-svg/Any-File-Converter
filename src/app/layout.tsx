import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Engineering Hub | Material & Calculation Tools",
  description: "Engineering Hub - Material & Calculation Tools. Secure and fast platform for project estimates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <div className="relative overflow-hidden min-h-screen" suppressHydrationWarning>
          <div className="hero-glow top-0 -left-20" />
          <div className="hero-glow bottom-0 -right-20" />
          {children}
        </div>
      </body>
    </html>
  );
}
