import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://3.142.111.235"),
  title: "Adam Normandin — AI Systems & Agents",
  description:
    "Custom AI bots + AI consulting — built around your docs, standards, and workflow. Typical $375/hr (scope-dependent). Setup often 2–3 hrs. Delivery usually within 1–3 days.",
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
      "Custom AI bots + AI consulting — built around your docs, standards, and workflow. Typical $375/hr (scope-dependent). Setup often 2–3 hrs. Delivery usually within 1–3 days.",
    images: [{ url: "/og.png" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Adam Normandin — AI Systems & Agents",
    description:
      "Custom AI bots + AI consulting — built around your docs, standards, and workflow. Typical $375/hr (scope-dependent). Setup often 2–3 hrs. Delivery usually within 1–3 days.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
