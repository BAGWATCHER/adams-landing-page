import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adamn.info"),
  title: "AI built for you — Adam Normandin",
  description:
    "Custom AI agents and bots that connect to your tools, run real workflows, and keep data handled with care. Builds from $3K. $375/hr. Delivery in days, not months.",
  other: { "theme-color": "#1a1a1a" },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
  },
  openGraph: {
    title: "AI built for you — Adam Normandin",
    description:
      "Custom AI agents and bots that connect to your tools and run real workflows. Builds from $3K. $375/hr.",
    images: [{ url: "/og-logo.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI built for you — Adam Normandin",
    description:
      "Custom AI agents and bots that connect to your tools and run real workflows. Builds from $3K. $375/hr.",
    images: ["/og-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
