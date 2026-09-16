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
  title: "JodoFund — Connect. Contribute. Change.",
  description: "JodoFund is a trusted community crowdfunding platform where people, families, communities, organizations, and meaningful causes can come together to raise and give support when it matters most.",
  keywords: ["crowdfunding in India", "trusted crowdfunding", "medical fundraising", "education fundraising", "emergency fundraising", "funeral fundraising", "community crowdfunding", "charity fundraising", "NGO fundraising", "crowdfunding for families", "crowdfunding for students", "JodoFund", "nonprofit fundraising", "animal welfare fundraising", "disaster relief crowdfunding", "secure crowdfunding", "verified fundraisers", "transparent donations", "crowdfunding with verification"],
  authors: [{ name: "JodoFund" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "JodoFund — Connect. Contribute. Change.",
    description: "A trusted community crowdfunding platform connecting people with causes that matter.",
    siteName: "JodoFund",
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
