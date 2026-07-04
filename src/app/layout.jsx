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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DriveLux — Premium Car Rental",
    template: "%s · DriveLux",
  },
  description:
    "Rent premium, meticulously maintained cars by the day. Transparent pricing, instant booking, no hidden fees.",
  keywords: [
    "car rental",
    "rent a car",
    "luxury car hire",
    "daily car rental",
    "DriveLux",
  ],
  authors: [{ name: "DriveLux" }],
  openGraph: {
    type: "website",
    siteName: "DriveLux",
    title: "DriveLux — Premium Car Rental",
    description:
      "Rent premium, meticulously maintained cars by the day. Transparent pricing, instant booking.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "DriveLux — Premium Car Rental",
    description:
      "Rent premium, meticulously maintained cars by the day.",
  },
};

export const viewport = {
  themeColor: "#0f4c81",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
