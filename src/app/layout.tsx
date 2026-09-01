import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GraceFund — Giving Hope. Sharing Grace. Changing Lives.",
  description: "GraceFund connects the Christian community to people, families, churches, ministries, and communities in need. Together, we turn generosity into real impact.",
  keywords: ["Christian crowdfunding", "church fundraising", "missionary support", "donate", "charity", "GraceFund"],
  authors: [{ name: "GraceFund" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "GraceFund — Giving Hope. Sharing Grace. Changing Lives.",
    description: "A modern Christian crowdfunding platform connecting people with causes that matter.",
    siteName: "GraceFund",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
