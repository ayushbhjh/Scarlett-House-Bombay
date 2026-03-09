import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: "Scarlett House Bombay | Luxury Dining in Bandra",
  description:
    "Reserve your table at Scarlett House Bombay. Discover European comfort food, artisanal cocktails, candle-lit ambience, and curated experiences by founder Malaika Arora.",
  metadataBase: new URL("https://scarletthousebombay.com"),
  openGraph: {
    title: "Scarlett House Bombay",
    description:
      "Mumbai's most artistic dining experience with premium cuisine, cocktails, and elegant interiors.",
    url: "https://scarletthousebombay.com",
    siteName: "Scarlett House Bombay",
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Scarlett House Bombay | Reserve a Table",
    description:
      "A luxury restaurant experience in Bandra blending comfort food, wine, and artistry."
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>{children}</body>
    </html>
  );
}
