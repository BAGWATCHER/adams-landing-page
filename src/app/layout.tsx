import type { Metadata } from "next";
import { Bebas_Neue, Chakra_Petch } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adamn.info"),
  title: "Adam Normandin — AI Systems & Agents",
  description:
    "Custom AI bots built around your docs, standards, and workflow. $375/hr, builds from $3K. Delivery in days, not months. API-only — your data is never stored or used for training.",
  other: { "theme-color": "#09090b" },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Adam Normandin — AI Systems & Agents",
    description:
      "Custom AI bots built around your docs, standards, and workflow. $375/hr, builds from $3K. Delivery in days, not months. API-only — your data is never stored or used for training.",
    images: [{ url: "/og.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Normandin — AI Systems & Agents",
    description:
      "Custom AI bots built around your docs, standards, and workflow. $375/hr, builds from $3K. Delivery in days, not months. API-only — your data is never stored or used for training.",
    images: ["/og.png"],
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
        className={`${chakraPetch.variable} ${bebasNeue.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
